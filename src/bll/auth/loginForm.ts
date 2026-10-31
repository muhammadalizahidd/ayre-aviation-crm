export interface LoginFormValues {
  username: string;
  password: string;
}

export type LoginFieldErrors = Partial<Record<keyof LoginFormValues, string>>;

/**
 * Client-side validation for the sign-in form. It exists for usability only;
 * the backend validates again and stays authoritative (AGENTS.md SEC-08).
 */
export function validateLoginForm(values: LoginFormValues): LoginFieldErrors {
  const errors: LoginFieldErrors = {};
  if (!values.username.trim()) errors.username = 'Enter your username';
  if (!values.password) errors.password = 'Enter your password';
  return errors;
}

export const hasErrors = (errors: LoginFieldErrors): boolean => Object.keys(errors).length > 0;
