'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { signIn as signInService, verifySession, type SignInResult } from '@/bll/auth/authService';
import { clearSession, readSession, writeSession } from '@/bll/auth/sessionStore';
import type { LoginFormValues } from '@/bll/auth/loginForm';
import type { Session } from '@/shared/schemas/user';

type AuthState =
  { status: 'loading' } | { status: 'anonymous' } | { status: 'authenticated'; session: Session };

interface AuthApi {
  state: AuthState;
  signIn: (values: LoginFormValues) => Promise<SignInResult>;
  signOut: () => void;
}

const AuthContext = createContext<AuthApi | null>(null);

/**
 * Holds the demo session for the browser tab (sessionStorage).
 * MOCK AUTHENTICATION: this is a prototype convenience, not security.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    // Restore the demo session of this browser tab. State is only set after an await,
    // never synchronously inside the effect body.
    void (async () => {
      const stored = readSession(window.sessionStorage);
      const valid = stored ? await verifySession(stored) : false;
      if (cancelled) return;
      if (stored && valid) {
        setState({ status: 'authenticated', session: stored });
        return;
      }
      if (stored) clearSession(window.sessionStorage);
      setState({ status: 'anonymous' });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (values: LoginFormValues): Promise<SignInResult> => {
    const result = await signInService(values);
    if (result.ok) {
      writeSession(window.sessionStorage, result.session);
      setState({ status: 'authenticated', session: result.session });
    }
    return result;
  }, []);

  const signOut = useCallback(() => {
    clearSession(window.sessionStorage);
    setState({ status: 'anonymous' });
  }, []);

  const api = useMemo(() => ({ state, signIn, signOut }), [state, signIn, signOut]);
  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthApi {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}
