import { z } from 'zod';
import { ROLES } from '@/shared/roles';
import { dashboardSchema } from '@/shared/schemas/dashboard';
import { storedUserSchema } from '@/shared/schemas/user';

/** Shape of src/database/data/mock-db.json. The file is the only "database" in this phase. */
export const mockDbSchema = z.object({
  _meta: z.object({
    demo: z.literal(true),
    schemaVersion: z.number().int(),
    /** Shown to users and developers: every record is fictional. */
    dataNotice: z.string(),
    refreshedLabel: z.string(),
    credentialsNotice: z.string(),
  }),
  users: z.array(storedUserSchema).min(1),
  dashboards: z.object(
    Object.fromEntries(ROLES.map((role) => [role, dashboardSchema])) as Record<
      (typeof ROLES)[number],
      typeof dashboardSchema
    >,
  ),
});

export type MockDb = z.infer<typeof mockDbSchema>;
