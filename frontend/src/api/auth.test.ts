import { afterEach, describe, expect, it, vi } from 'vitest';
import { login } from './auth';

describe('auth api', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('logs in and returns token payload', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Success',
        data: {
          token: 'jwt-token',
          username: 'admin',
          nickname: 'Bowen',
        },
      }),
    } as Response);

    vi.stubGlobal('fetch', fetchMock);

    const result = await login({ username: 'admin', password: 'admin123456' });

    expect(result.token).toBe('jwt-token');
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/admin/login',
      expect.objectContaining({
        method: 'POST',
      }),
    );
  });
});
