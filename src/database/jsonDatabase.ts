import rawDb from './data/mock-db.json';
import { mockDbSchema, type MockDb } from './schema';
import type { Database } from './repositories';

let cached: Database | undefined;

/**
 * Builds the JSON-backed database. The file is validated once; a malformed
 * edit to mock-db.json fails loudly here instead of breaking a screen later.
 */
export function getDatabase(): Database {
  if (cached) return cached;

  const db: MockDb = mockDbSchema.parse(rawDb);

  cached = {
    users: {
      findByUsername: (username) =>
        db.users.find((user) => user.username.toLowerCase() === username.trim().toLowerCase()),
      findById: (id) => db.users.find((user) => user.id === id),
    },
    dashboards: {
      getForRole: (role) => db.dashboards[role],
    },
    meta: {
      get: () => ({ dataNotice: db._meta.dataNotice, refreshedLabel: db._meta.refreshedLabel }),
    },
  };
  return cached;
}
