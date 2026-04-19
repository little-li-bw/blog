import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AdminPostCreate from './AdminPostCreate';

describe('AdminPostCreate page', () => {
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

  it('creates post and redirects to admin posts', async () => {
    vi.stubGlobal('fetch', vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url === '/api/categories') {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            success: true,
            message: 'Success',
            data: [{ id: 1, name: 'Java', sort: 1 }],
          }),
        } as Response);
      }

      if (url === '/api/tags') {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            success: true,
            message: 'Success',
            data: [{ id: 1, name: 'Spring Boot' }],
          }),
        } as Response);
      }

      if (url === '/api/admin/posts') {
        const headers = new Headers(init?.headers);
        expect(headers.get('Authorization')).toBe('Bearer jwt-token');
        expect(init?.method).toBe('POST');

        return Promise.resolve({
          ok: true,
          json: async () => ({
            success: true,
            message: 'Success',
            data: {
              id: 1,
              title: 'Spring Boot Notes',
              summary: 'Summary',
              contentHtml: '<p>Body</p>',
              status: 'DRAFT',
              categoryId: 1,
              categoryName: 'Java',
              tags: ['Spring Boot'],
              viewCount: 0,
              publishTime: null,
              previousPost: null,
              nextPost: null,
            },
          }),
        } as Response);
      }

      throw new Error(`Unexpected request: ${url}`);
    }));

    render(
      <MemoryRouter initialEntries={['/admin/posts/new']}>
        <Routes>
          <Route path="/admin/posts/new" element={<AdminPostCreate />} />
          <Route path="/admin/posts" element={<div>后台文章管理</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText('文章标题')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('文章标题'), { target: { value: 'Spring Boot Notes' } });
    fireEvent.change(screen.getByLabelText('文章摘要'), { target: { value: 'Summary' } });
    fireEvent.change(screen.getByLabelText('Markdown 正文'), { target: { value: '# Title' } });
    fireEvent.change(screen.getByLabelText('分类'), { target: { value: '1' } });
    fireEvent.click(screen.getByLabelText('Spring Boot'));
    fireEvent.click(screen.getByRole('button', { name: '保存草稿' }));

    await waitFor(() => {
      expect(screen.getByText('后台文章管理')).toBeInTheDocument();
    });
  });
});
