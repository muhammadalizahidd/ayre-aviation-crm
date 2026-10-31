import { z } from 'zod';
import { ROLES } from '../roles';

/** A user as stored in the mock database. The password is demo-only (see mock-db.json _meta). */
export const storedUserSchema = z.object({
  id: z.string(),
  username: z.string().min(1),
  password: z.string().min(1),
  displayName: z.string(),
  initials: z.string().max(3),
  title: z.string(),
  roleLabel: z.string(),
  role: z.enum(ROLES),
  teamId: z.string().nullable(),
});

/** A user as exposed to the client. Never includes the password. */
export const publicUserSchema = storedUserSchema.omit({ password: true });

export const loginRequestSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const sessionSchema = z.object({
  token: z.string(),
  user: publicUserSchema,
});

export type StoredUser = z.infer<typeof storedUserSchema>;
export type PublicUser = z.infer<typeof publicUserSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type Session = z.infer<typeof sessionSchema>;
