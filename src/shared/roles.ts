/** The four user roles of the platform (PRD 3.2; the Finance role is shown as "Finance Manager"). */
export const ROLES = ['executive', 'sales_manager', 'broker', 'finance'] as const;

export type Role = (typeof ROLES)[number];

export const isRole = (value: unknown): value is Role =>
  typeof value === 'string' && (ROLES as readonly string[]).includes(value);
