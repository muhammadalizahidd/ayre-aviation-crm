import type { ReactNode } from 'react';
import { AppShell } from '@/features/shell/AppShell';

/** Every signed-in page shares the shell: sidebar and top bar. */
export default function AppLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
