import { handleRequest } from '@/backend/router';
import { isProblem } from '@/backend/http';
import { ApiError } from '@/shared/problem';
import { dashboardSchema, type Dashboard } from '@/shared/schemas/dashboard';
import {
  publicUserSchema,
  sessionSchema,
  type LoginRequest,
  type PublicUser,
  type Session,
} from '@/shared/schemas/user';
import type { z } from 'zod';

/**
 * The only door the business logic layer uses to reach data.
 *
 * Today the transport calls the in-process mock backend. For a real server, replace
 * `send` with a `fetch` to the real base URL; nothing above this file changes.
 */
async function send<T>(
  method: 'GET' | 'POST',
  path: string,
  schema: z.ZodType<T>,
  options: { body?: unknown; token?: string } = {},
): Promise<T> {
  const response = await handleRequest({ method, path, ...options });
  if (isProblem(response.body)) throw new ApiError(response.body);
  // Contract check: the response must match the shared schema, exactly as it would over HTTP.
  return schema.parse(response.body);
}

export const apiClient = {
  login: (request: LoginRequest): Promise<Session> =>
    send('POST', '/api/v1/auth/login', sessionSchema, { body: request }),
  me: (token: string): Promise<PublicUser> =>
    send('GET', '/api/v1/auth/me', publicUserSchema, { token }),
  getDashboard: (token: string): Promise<Dashboard> =>
    send('GET', '/api/v1/dashboard', dashboardSchema, { token }),
};

export type ApiClient = typeof apiClient;
