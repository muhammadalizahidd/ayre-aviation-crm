import { apiClient } from '@/api-client';
import { ApiError } from '@/shared/problem';
import type { Session } from '@/shared/schemas/user';
import {
  hasErrors,
  validateLoginForm,
  type LoginFieldErrors,
  type LoginFormValues,
} from './loginForm';

export type SignInResult =
  { ok: true; session: Session } | { ok: false; fieldErrors: LoginFieldErrors; formError?: string };

const GENERIC_FAILURE = 'Something went wrong. Try again.';

/** Validates the form, signs in through the API client and translates failures into user-facing messages. */
export async function signIn(values: LoginFormValues): Promise<SignInResult> {
  const fieldErrors = validateLoginForm(values);
  if (hasErrors(fieldErrors)) return { ok: false, fieldErrors };

  try {
    const session = await apiClient.login({
      username: values.username.trim(),
      password: values.password,
    });
    return { ok: true, session };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.problem.fieldErrors) return { ok: false, fieldErrors: error.problem.fieldErrors };
      return { ok: false, fieldErrors: {}, formError: error.problem.title };
    }
    return { ok: false, fieldErrors: {}, formError: GENERIC_FAILURE };
  }
}

/** Confirms that a stored session is still accepted by the backend. */
export async function verifySession(session: Session): Promise<boolean> {
  try {
    await apiClient.me(session.token);
    return true;
  } catch {
    return false;
  }
}
