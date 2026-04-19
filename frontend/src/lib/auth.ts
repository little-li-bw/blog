const ADMIN_TOKEN_KEY = 'blog_admin_token';
const ADMIN_USER_KEY = 'blog_admin_user';

export interface AdminSession {
  token: string;
  username: string;
  nickname: string;
}

export function saveAdminSession(session: AdminSession): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, session.token);
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(session));
}

export function getAdminToken(): string {
  return localStorage.getItem(ADMIN_TOKEN_KEY) || '';
}

export function getAdminSession(): AdminSession | null {
  const raw = localStorage.getItem(ADMIN_USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AdminSession;
  } catch {
    return null;
  }
}

export function clearAdminSession(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}
