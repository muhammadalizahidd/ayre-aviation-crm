import { getDatabase } from '@/database/jsonDatabase';
import type { PublicUser, StoredUser } from '@/shared/schemas/user';

/**
 * MOCK AUTHENTICATION. This is not security.
 * The token only encodes the user id so the mock backend can tell who is calling.
 * A real backend replaces this file with signed, expiring tokens.
 */
const TOKEN_PREFIX = 'demo-token';

export const issueToken = (user: StoredUser): string =>
  `${TOKEN_PREFIX}.${user.id}.${Date.now().toString(36)}`;

/** Whitelist mapping: only fields that are safe to send to the client. The password is never copied. */
export function toPublicUser(user: StoredUser): PublicUser {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    initials: user.initials,
    title: user.title,
    roleLabel: user.roleLabel,
    role: user.role,
    teamId: user.teamId,
  };
}

/** Resolves the caller from a token, or undefined when the token is missing, malformed or unknown. */
export function authenticate(token: string | undefined): StoredUser | undefined {
  if (!token) return undefined;
  const [prefix, userId] = token.split('.');
  if (prefix !== TOKEN_PREFIX || !userId) return undefined;
  return getDatabase().users.findById(userId);
}
