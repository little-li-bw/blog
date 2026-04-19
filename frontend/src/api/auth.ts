import type { LoginPayload, LoginResponse } from '../types';
import { apiRequest } from './client';

export function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/api/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}
