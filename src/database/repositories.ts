import type { Role } from '@/shared/roles';
import type { Dashboard } from '@/shared/schemas/dashboard';
import type { StoredUser } from '@/shared/schemas/user';

/**
 * Repository contracts. The backend layer depends on these interfaces only.
 * A real database later means a new implementation of the same interfaces.
 */
export interface UserRepository {
  findByUsername(username: string): StoredUser | undefined;
  findById(id: string): StoredUser | undefined;
}

export interface DashboardRepository {
  getForRole(role: Role): Dashboard;
}

export interface DatabaseMeta {
  dataNotice: string;
  refreshedLabel: string;
}

export interface MetaRepository {
  get(): DatabaseMeta;
}

export interface Database {
  users: UserRepository;
  dashboards: DashboardRepository;
  meta: MetaRepository;
}
