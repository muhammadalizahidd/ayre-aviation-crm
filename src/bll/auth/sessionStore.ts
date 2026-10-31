import { sessionSchema, type Session } from '@/shared/schemas/user';

/** The subset of the Web Storage API the session store needs. Injected so tests need no browser. */
export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const SESSION_STORAGE_KEY = 'ayre.demo.session';

/** Reads a stored session. Returns undefined when missing or malformed (never throws). */
export function readSession(storage: KeyValueStorage): Session | undefined {
  try {
    const raw = storage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = sessionSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : undefined;
  } catch {
    return undefined;
  }
}

export function writeSession(storage: KeyValueStorage, session: Session): void {
  storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearSession(storage: KeyValueStorage): void {
  storage.removeItem(SESSION_STORAGE_KEY);
}
