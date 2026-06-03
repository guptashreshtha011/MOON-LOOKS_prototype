// Auth constants and utilities
export const AUTH_KEYS = {
  TOKEN_KEY: "moonlooks_token",
  USER_KEY: "moonlooks_user",
  VERIFICATION_REQUIRED: "moonlooks_email_verification_pending"
};

export function getStoredToken(): string | null {
  return localStorage.getItem(AUTH_KEYS.TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(AUTH_KEYS.TOKEN_KEY, token);
}

export function clearStoredAuth(): void {
  localStorage.removeItem(AUTH_KEYS.TOKEN_KEY);
  localStorage.removeItem(AUTH_KEYS.USER_KEY);
  localStorage.removeItem(AUTH_KEYS.VERIFICATION_REQUIRED);
}
