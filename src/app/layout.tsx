import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import type { ReactNode } from 'react';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { resolveThemeName } from '@/theme/themes';
import { ToastProvider } from '@/ui/Toast';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ayre Aviation CRM',
  description: 'Ayre Aviation broker CRM. Frontend prototype on mock data (DEMO DATA).',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // The theme is chosen by configuration. The attribute is set on the server so there is no flash.
  const theme = resolveThemeName(process.env.NEXT_PUBLIC_THEME);

  return (
    <html lang="en" data-theme={theme} className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
