import { getDatabase } from '@/database/jsonDatabase';
import { loginRequestSchema, type Session } from '@/shared/schemas/user';
import type { Dashboard } from '@/shared/schemas/dashboard';
import { authenticate, issueToken, toPublicUser } from './auth';
import { ok, problem, type BackendResponse } from './http';

/** Everything a handler needs to know about the incoming request. */
export interface RequestContext {
  body?: unknown;
  token?: string;
}

/** POST /api/v1/auth/login */
export function login(ctx: RequestContext): BackendResponse<Session> {
  const parsed = loginRequestSchema.safeParse(ctx.body);
  if (!parsed.success) {
    return problem(400, 'request.invalid', 'The request is not valid.');
  }

  const fieldErrors: Record<string, string> = {};
  if (!parsed.data.username.trim()) fieldErrors.username = 'Enter your username';
  if (!parsed.data.password) fieldErrors.password = 'Enter your password';
  if (Object.keys(fieldErrors).length > 0) {
    return problem(400, 'validation.failed', 'Check the highlighted fields.', { fieldErrors });
  }

  const user = getDatabase().users.findByUsername(parsed.data.username);
  // Same answer for an unknown user and a wrong password, so the response does not reveal which one failed.
  if (!user || user.password !== parsed.data.password) {
    return problem(
      401,
      'auth.invalid_credentials',
      "That username and password don't match. Try again.",
    );
  }

  return ok({ token: issueToken(user), user: toPublicUser(user) });
}

/** GET /api/v1/auth/me */
export function me(ctx: RequestContext): BackendResponse<Session['user']> {
  const user = authenticate(ctx.token);
  if (!user) return problem(401, 'auth.required', 'Sign in to continue.');
  return ok(toPublicUser(user));
}

/** GET /api/v1/dashboard : the dashboard of the caller's own role, nothing else. */
export function dashboard(ctx: RequestContext): BackendResponse<Dashboard> {
  const user = authenticate(ctx.token);
  if (!user) return problem(401, 'auth.required', 'Sign in to continue.');
  const db = getDatabase();
  return ok({ ...db.dashboards.getForRole(user.role), meta: db.meta.get() });
}
