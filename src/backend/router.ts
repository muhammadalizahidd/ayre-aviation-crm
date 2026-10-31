import { dashboard, login, me, type RequestContext } from './handlers';
import { problem, type BackendResponse } from './http';

type Handler = (ctx: RequestContext) => BackendResponse;

/** The mock API surface. Paths follow the versioned convention of the real API (PRD 9.1, API-01). */
const routes: Record<string, Handler> = {
  'POST /api/v1/auth/login': login,
  'GET /api/v1/auth/me': me,
  'GET /api/v1/dashboard': dashboard,
};

export interface BackendRequest extends RequestContext {
  method: 'GET' | 'POST';
  path: string;
}

const latencyMs = (): number => {
  const raw = process.env.NEXT_PUBLIC_MOCK_LATENCY_MS;
  const value = raw === undefined ? 250 : Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : 250;
};

/**
 * Entry point of the mock backend. Simulates network latency so loading states are real.
 * Replaced by an HTTP transport in `src/api-client` when a real server exists.
 */
export async function handleRequest(request: BackendRequest): Promise<BackendResponse> {
  const delay = latencyMs();
  if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));

  const handler = routes[`${request.method} ${request.path}`];
  if (!handler) return problem(404, 'route.not_found', 'That endpoint does not exist.');

  try {
    return handler({ body: request.body, token: request.token });
  } catch {
    return problem(500, 'server.unexpected', 'Something went wrong. Try again.');
  }
}
