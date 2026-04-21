import { afterEach, describe, expect, it, vi } from 'vitest';

describe('auth api', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('logs in and returns token payload', async () => {
    const { login } = await import('./auth');
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

  it('avoids duplicating /api when VITE_API_BASE_URL already includes it', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '/api');
    vi.resetModules();
    const { login } = await import('./auth');

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

    await login({ username: 'admin', password: 'admin123456' });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/admin/login',
      expect.objectContaining({
        method: 'POST',
      }),
    );
  });
});
