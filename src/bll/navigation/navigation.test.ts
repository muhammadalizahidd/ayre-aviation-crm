import { describe, expect, it } from 'vitest';
import { ROLES } from '@/shared/roles';
import { canOpen, HOME_LABEL, navigationFor } from './navigation';

describe('navigationFor', () => {
  it('starts every role with its own named home item', () => {
    for (const role of ROLES) {
      const first = navigationFor(role)[0];
      expect(first?.href).toBe('/dashboard');
      expect(first?.label).toBe(HOME_LABEL[role]);
    }
  });

  it('shows the Executive the whole menu (14 items)', () => {
    expect(navigationFor('executive')).toHaveLength(14);
  });

  it('does not render finance or administration items for a broker (hidden, not locked)', () => {
    const ids = navigationFor('broker').map((i) => i.id);
    expect(ids).not.toContain('finance');
    expect(ids).not.toContain('admin');
    expect(ids).not.toContain('operators');
  });

  it('gives the Finance Manager finance and commissions but no sales items', () => {
    const ids = navigationFor('finance').map((i) => i.id);
    expect(ids).toEqual(expect.arrayContaining(['finance', 'commissions', 'reports']));
    expect(ids).not.toContain('leads');
    expect(ids).not.toContain('trips');
  });

  it('keeps Administration for the Executive only, preceded by a divider', () => {
    for (const role of ROLES) {
      const admin = navigationFor(role).find((i) => i.id === 'admin');
      expect(Boolean(admin)).toBe(role === 'executive');
      if (admin) expect(admin.dividerBefore).toBe(true);
    }
  });

  it('covers every PRD module 01 to 17 across the executive menu', () => {
    const covered = new Set(navigationFor('executive').flatMap((i) => i.modules));
    for (let n = 1; n <= 17; n++) expect(covered.has(String(n).padStart(2, '0'))).toBe(true);
  });
});

describe('canOpen', () => {
  it('lets every role open the dashboard', () => {
    for (const role of ROLES) expect(canOpen(role, '/dashboard')).toBe(true);
  });

  it('refuses routes outside the role', () => {
    expect(canOpen('broker', '/admin')).toBe(false);
    expect(canOpen('sales_manager', '/finance')).toBe(false);
    expect(canOpen('executive', '/admin')).toBe(true);
  });
});
