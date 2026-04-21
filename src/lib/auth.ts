const AUTH_TOKEN_KEY = "stridesync_auth_token";
const AUTH_USER_KEY = "stridesync_auth_user";

export type AuthUser = {
  _id: string;
  name: string;
  email: string;
};

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthSession(token: string, user: AuthUser): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearAuthSession(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getAuthUser(): AuthUser | null {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch (_err) {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
