import { beforeAll, describe, expect, it } from 'vitest';
import { hasErrors, validateLoginForm } from './loginForm';
import {
  clearSession,
  readSession,
  SESSION_STORAGE_KEY,
  writeSession,
  type KeyValueStorage,
} from './sessionStore';
import { signIn, verifySession } from './authService';

beforeAll(() => {
  process.env.NEXT_PUBLIC_MOCK_LATENCY_MS = '0';
});

const memoryStorage = (): KeyValueStorage & { data: Map<string, string> } => {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: (key) => void data.delete(key),
  };
};

describe('validateLoginForm', () => {
  it('requires a username and a password', () => {
    const errors = validateLoginForm({ username: '  ', password: '' });
    expect(errors.username).toBe('Enter your username');
    expect(errors.password).toBe('Enter your password');
    expect(hasErrors(errors)).toBe(true);
  });
  it('accepts filled values', () => {
    expect(hasErrors(validateLoginForm({ username: 'broker', password: 'x' }))).toBe(false);
  });
});

describe('session store', () => {
  const session = {
    token: 't',
    user: {
      id: 'U',
      username: 'u',
      displayName: 'D',
      initials: 'D',
      title: 'T',
      roleLabel: 'Broker',
      role: 'broker',
      teamId: null,
    },
  } as const;

  it('round-trips a session', () => {
    const storage = memoryStorage();
    writeSession(storage, session);
    expect(readSession(storage)).toEqual(session);
    clearSession(storage);
    expect(readSession(storage)).toBeUndefined();
  });

  it('ignores malformed stored data instead of throwing', () => {
    const storage = memoryStorage();
    storage.setItem(SESSION_STORAGE_KEY, '{not json');
    expect(readSession(storage)).toBeUndefined();
    storage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ token: 1 }));
    expect(readSession(storage)).toBeUndefined();
  });
});

describe('signIn (through the mock backend)', () => {
  it('does not call the backend when the form is invalid', async () => {
    const result = await signIn({ username: '', password: '' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.fieldErrors.username).toBeDefined();
  });

  it('gives one generic message for a wrong password and an unknown user', async () => {
    const wrongPassword = await signIn({ username: 'broker', password: 'definitely-wrong' });
    const unknownUser = await signIn({ username: 'nobody', password: 'definitely-wrong' });
    expect(wrongPassword).toEqual(unknownUser);
    expect(wrongPassword.ok).toBe(false);
    if (!wrongPassword.ok)
      expect(wrongPassword.formError).toBe("That username and password don't match. Try again.");
  });

  it('rejects a token the backend does not know', async () => {
    expect(
      await verifySession({
        token: 'forged',
        user: {
          id: 'x',
          username: 'x',
          displayName: 'x',
          initials: 'X',
          title: 'x',
          roleLabel: 'x',
          role: 'broker',
          teamId: null,
        },
      }),
    ).toBe(false);
  });
});
