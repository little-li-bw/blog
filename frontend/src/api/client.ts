import type { ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

function buildRequestUrl(path: string): string {
  const normalizedBase = API_BASE_URL.replace(/\/+$/, '');
  if (!normalizedBase) {
    return path;
  }

  if (normalizedBase.endsWith('/api') && path.startsWith('/api/')) {
    return `${normalizedBase}${path.slice(4)}`;
  }

  return `${normalizedBase}${path}`;
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(buildRequestUrl(path), init);
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'Request failed');
  }

  return payload.data;
}

export async function adminApiRequest<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set('Authorization', `Bearer ${token}`);

  if (init?.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return apiRequest<T>(path, {
    ...init,
    headers,
  });
}
