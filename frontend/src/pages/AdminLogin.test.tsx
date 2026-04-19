import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AdminLogin from './AdminLogin';

describe('AdminLogin page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('submits credentials and redirects to admin posts', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
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
    } as Response));

    render(
      <MemoryRouter initialEntries={['/admin/login']}>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/posts" element={<div>后台文章管理</div>} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: 'admin123456' } });
    fireEvent.click(screen.getByRole('button', { name: '登录后台' }));

    await waitFor(() => {
      expect(screen.getByText('后台文章管理')).toBeInTheDocument();
    });

    expect(localStorage.getItem('blog_admin_token')).toBe('jwt-token');
  });
});
