import { redirect } from 'next/navigation';

/** The root has no page of its own: signed-in users land on their dashboard, others are sent to /login by the shell. */
export default function RootPage(): never {
  redirect('/dashboard');
}
