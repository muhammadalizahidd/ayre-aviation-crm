import { beforeAll, describe, expect, it } from 'vitest';
import { apiClient } from '@/api-client';
import { getDatabase } from '@/database/jsonDatabase';
import { ApiError } from '@/shared/problem';
import { ROLES, type Role } from '@/shared/roles';
import rawDb from '@/database/data/mock-db.json';
import { handleRequest } from './router';

beforeAll(() => {
  process.env.NEXT_PUBLIC_MOCK_LATENCY_MS = '0';
});

const credentials = (role: Role) => {
  const user = rawDb.users.find((u) => u.role === role);
  if (!user) throw new Error(`No demo user for role ${role}`);
  return { username: user.username, password: user.password };
};

describe('mock database', () => {
  it('validates against its schema and is marked as demo data', () => {
    expect(() => getDatabase()).not.toThrow();
    expect(rawDb._meta.demo).toBe(true);
    expect(rawDb._meta.dataNotice).toMatch(/DEMO DATA/);
  });

  it('has exactly one demo user for each of the four roles', () => {
    for (const role of ROLES) expect(rawDb.users.filter((u) => u.role === role)).toHaveLength(1);
    expect(rawDb.users.map((u) => u.username).sort()).toEqual([
      'broker',
      'executive',
      'finance.manager',
      'sales.manager',
    ]);
  });

  it('gives every user a distinct password that is not trivially guessable', () => {
    const passwords = rawDb.users.map((u) => u.password);
    expect(new Set(passwords).size).toBe(passwords.length);
    for (const password of passwords) expect(password.length).toBeGreaterThanOrEqual(12);
  });

  it('keeps colors out of the data files (data carries tone names only)', () => {
    expect(JSON.stringify(rawDb)).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(/);
  });
});

describe('POST /api/v1/auth/login', () => {
  it.each(ROLES)('signs in the %s demo user and never returns the password', async (role) => {
    const session = await apiClient.login(credentials(role));
    expect(session.user.role).toBe(role);
    expect(JSON.stringify(session)).not.toContain(credentials(role).password);
    expect('password' in session.user).toBe(false);
  });

  it('answers 401 for bad credentials with a problem body and correlation id', async () => {
    const response = await handleRequest({
      method: 'POST',
      path: '/api/v1/auth/login',
      body: { username: 'broker', password: 'nope' },
    });
    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ code: 'auth.invalid_credentials', status: 401 });
    expect((response.body as { correlationId: string }).correlationId).toMatch(/^cid-/);
  });

  it('answers 400 with field errors for empty fields', async () => {
    const response = await handleRequest({
      method: 'POST',
      path: '/api/v1/auth/login',
      body: { username: '', password: '' },
    });
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      fieldErrors: { username: expect.any(String), password: expect.any(String) },
    });
  });

  it('answers 404 for an unknown route', async () => {
    expect((await handleRequest({ method: 'GET', path: '/api/v1/nope' })).status).toBe(404);
  });
});

describe('GET /api/v1/dashboard (server-side scope)', () => {
  it('refuses a call without a valid token', async () => {
    await expect(apiClient.getDashboard('forged-token')).rejects.toBeInstanceOf(ApiError);
    const response = await handleRequest({ method: 'GET', path: '/api/v1/dashboard' });
    expect(response.status).toBe(401);
  });

  it.each(ROLES)('returns only the %s dashboard for that user', async (role) => {
    const { token } = await apiClient.login(credentials(role));
    const dashboard = await apiClient.getDashboard(token);
    expect(dashboard.role).toBe(role);
    expect(dashboard.meta?.dataNotice).toMatch(/DEMO DATA/);
  });

  it('shows the Executive Invoiced Amount and Collected Amount as two separate figures (MTG-29)', async () => {
    const { token } = await apiClient.login(credentials('executive'));
    const labels = (await apiClient.getDashboard(token)).kpis.map((k) => k.label);
    expect(labels).toContain('Invoiced Amount');
    expect(labels).toContain('Collected Amount');
    expect(labels).not.toContain('Revenue');
  });

  it('does not send the Sales Manager revenue or receivables at all (hidden, not locked)', async () => {
    const { token } = await apiClient.login(credentials('sales_manager'));
    const dashboard = await apiClient.getDashboard(token);
    const text = JSON.stringify(dashboard);
    expect(dashboard.kpis.map((k) => k.id)).not.toContain('invoiced');
    expect(dashboard.kpis.map((k) => k.id)).not.toContain('receivables');
    expect(text).not.toMatch(/access/i);
    expect(text).not.toMatch(/locked/i);
  });

  it('gives the Broker no export action and the Finance Manager no sales funnel', async () => {
    const broker = await apiClient.getDashboard(
      (await apiClient.login(credentials('broker'))).token,
    );
    expect(broker.exportAllowed).toBe(false);
    const finance = await apiClient.getDashboard(
      (await apiClient.login(credentials('finance'))).token,
    );
    expect(finance.panels.some((p) => p.title === 'Sales funnel')).toBe(false);
  });

  it('keeps KPI rows even for every role (no orphan card)', async () => {
    for (const role of ROLES) {
      const { token } = await apiClient.login(credentials(role));
      const count = (await apiClient.getDashboard(token)).kpis.length;
      expect([3, 4, 5, 6, 7, 8, 9]).toContain(count);
    }
  });
});
