'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useState, type FormEvent } from 'react';
import type { LoginFieldErrors } from '@/bll/auth/loginForm';
import { validateLoginForm, hasErrors } from '@/bll/auth/loginForm';
import { Wordmark } from '@/ui/Brand';
import { useAuth } from './AuthProvider';

const INPUT_BOX = 'flex rounded-lg border bg-surface-login-field focus-within:border-line-focus';

/** The sign-in screen: black photo field on the left, ink form panel on the right (DESIGN.md section 5, login). */
export function LoginScreen() {
  const router = useRouter();
  const { state, signIn } = useAuth();
  const ids = { username: useId(), password: useId() };
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [formError, setFormError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (state.status === 'authenticated') router.replace('/dashboard');
  }, [state.status, router]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(undefined);

    const local = validateLoginForm({ username, password });
    setFieldErrors(local);
    if (hasErrors(local)) return;

    setBusy(true);
    const result = await signIn({ username, password });
    setBusy(false);
    if (!result.ok) {
      setFieldErrors(result.fieldErrors);
      setFormError(result.formError);
    }
  }

  return (
    <main className="grid min-h-screen grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)] bg-surface-login-hero text-fg-on-dark max-[900px]:grid-cols-1">
      <section className="relative flex min-h-screen flex-col justify-between overflow-hidden px-14 py-10 max-[900px]:min-h-0 max-[900px]:px-6 max-[900px]:py-7">
        <div className="absolute inset-0 bg-surface-login-hero" aria-hidden="true">
          <Image
            src="/login-hero.jpg"
            alt=""
            fill
            priority
            sizes="(max-width: 900px) 100vw, 60vw"
            className="fade-in-slow !top-auto !h-[80%] object-cover [object-position:72%_45%]"
          />
          <div className="login-scrim absolute inset-0" />
        </div>

        <div className="relative">
          <Wordmark variant="login" />
        </div>

        <div className="relative mb-auto pt-[6vh]">
          <h1 className="fade-in font-serif text-[clamp(38px,5vw,64px)] font-semibold leading-[1.05] [text-shadow:0_2px_24px_var(--c-scrim-heavy)]">
            Ayre Aviation CRM
          </h1>
          <p className="fade-in mt-3.5 max-w-[44ch] text-[15px] text-fg-on-dark-muted">
            Every customer, trip, quote and booking in one quiet, precise place.
          </p>
        </div>

        <p className="relative flex items-center gap-2 text-xs text-fg-on-dark-subtle">
          <span
            className="h-[7px] w-[7px] rounded-full bg-status-warning-solid"
            aria-hidden="true"
          />
          DEMO DATA. All data is mocked. Avinode and Paynode are NOT CONNECTED.
        </p>
      </section>

      <section className="fade-in flex items-center border-l border-line-on-dark bg-surface-login-panel p-12 max-[900px]:border-l-0 max-[900px]:border-t max-[900px]:px-6 max-[900px]:py-8">
        <form onSubmit={onSubmit} noValidate className="mx-auto w-full max-w-[360px]">
          <h2 className="font-serif text-[28px] font-semibold">Sign in</h2>
          <p className="mb-6 mt-1.5 text-fg-on-dark-muted">
            Access is by invitation from your administrator.
          </p>

          {formError ? (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-status-danger-solid bg-status-danger-tint px-3 py-2.5 text-[13px] text-fg-danger-on-dark-strong"
            >
              {formError}
            </div>
          ) : null}

          <div className="mb-4">
            <label
              htmlFor={ids.username}
              className="mb-1.5 block text-[13px] text-fg-on-dark-muted"
            >
              Username
            </label>
            <div
              className={`${INPUT_BOX} ${fieldErrors.username ? 'border-status-danger-solid' : 'border-line-on-dark'}`}
            >
              <input
                id={ids.username}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="Your username"
                aria-invalid={Boolean(fieldErrors.username)}
                className="min-w-0 flex-1 bg-transparent px-3.5 py-3 text-fg-on-dark outline-none placeholder:text-fg-on-dark-subtle"
              />
            </div>
            {fieldErrors.username ? (
              <p className="mt-1.5 text-xs text-fg-danger-on-dark">{fieldErrors.username}</p>
            ) : null}
          </div>

          <div className="mb-6">
            <label
              htmlFor={ids.password}
              className="mb-1.5 block text-[13px] text-fg-on-dark-muted"
            >
              Password
            </label>
            <div
              className={`${INPUT_BOX} ${fieldErrors.password ? 'border-status-danger-solid' : 'border-line-on-dark'}`}
            >
              <input
                id={ids.password}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                placeholder="Your password"
                aria-invalid={Boolean(fieldErrors.password)}
                className="min-w-0 flex-1 bg-transparent px-3.5 py-3 text-fg-on-dark outline-none placeholder:text-fg-on-dark-subtle"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="px-3.5 text-xs text-fg-on-dark-muted"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {fieldErrors.password ? (
              <p className="mt-1.5 text-xs text-fg-danger-on-dark">{fieldErrors.password}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg border border-action-primary-bg bg-action-primary-bg py-3 font-semibold text-action-primary-text transition-colors hover:bg-action-primary-hover-bg hover:text-action-primary-hover-text disabled:cursor-progress disabled:opacity-80"
          >
            {busy ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="mt-6 text-xs text-fg-on-dark-subtle">
            Demo sign-in with mocked users. This is not secure authentication.
          </p>
        </form>
      </section>
    </main>
  );
}
