import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AdminSiteConfig from './AdminSiteConfig';

describe('AdminSiteConfig page', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('blog_admin_token', 'jwt-token');
    localStorage.setItem(
      'blog_admin_user',
      JSON.stringify({ token: 'jwt-token', username: 'admin', nickname: 'Bowen' }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads site config and updates it', async () => {
    vi.stubGlobal('fetch', vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url === '/api/admin/site-config' && (!init?.method || init.method === 'GET')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            success: true,
            message: 'Success',
            data: {
              siteName: 'Bowen Blog',
              heroTitle: 'Java Backend Developer',
              heroSubtitle: 'Programming notes and technical practice',
              aboutMe: 'About me',
              skillsBackend: 'Java, Spring Boot',
              skillsFrontend: 'React',
              skillsDatabase: 'MySQL',
              skillsTools: 'Docker',
              email: 'bowen@example.com',
              githubUrl: 'https://github.com/bowen',
              resumeUrl: 'https://example.com/resume.pdf',
            },
          }),
        } as Response);
      }

      if (url === '/api/admin/site-config' && init?.method === 'PUT') {
        const headers = new Headers(init.headers);
        expect(headers.get('Authorization')).toBe('Bearer jwt-token');

        return Promise.resolve({
          ok: true,
          json: async () => ({
            success: true,
            message: 'Success',
            data: {
              siteName: 'Bowen Blog Updated',
              heroTitle: 'Java Backend Developer',
              heroSubtitle: 'Programming notes and technical practice',
              aboutMe: 'Updated about me',
              skillsBackend: 'Java, Spring Boot',
              skillsFrontend: 'React',
              skillsDatabase: 'MySQL',
              skillsTools: 'Docker',
              email: 'updated@example.com',
              githubUrl: 'https://github.com/bowen-updated',
              resumeUrl: 'https://example.com/resume-new.pdf',
            },
          }),
        } as Response);
      }

      throw new Error(`Unexpected request: ${url}`);
    }));

    render(
      <MemoryRouter initialEntries={['/admin/site-config']}>
        <Routes>
          <Route path="/admin/site-config" element={<AdminSiteConfig />} />
          <Route path="/admin/posts" element={<div>后台文章管理</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText('站点名称')).toHaveValue('Bowen Blog');
    });

    fireEvent.change(screen.getByLabelText('站点名称'), { target: { value: 'Bowen Blog Updated' } });
    fireEvent.change(screen.getByLabelText('关于我'), { target: { value: 'Updated about me' } });
    fireEvent.change(screen.getByLabelText('邮箱'), { target: { value: 'updated@example.com' } });
    fireEvent.change(screen.getByLabelText('GitHub 链接'), { target: { value: 'https://github.com/bowen-updated' } });
    fireEvent.change(screen.getByLabelText('简历链接'), { target: { value: 'https://example.com/resume-new.pdf' } });
    fireEvent.click(screen.getByRole('button', { name: '保存配置' }));

    await waitFor(() => {
      expect(screen.getByText('配置已保存')).toBeInTheDocument();
    });
  });
});
