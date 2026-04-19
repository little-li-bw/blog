import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AdminPostEdit from './AdminPostEdit';

describe('AdminPostEdit page', () => {
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

  it('loads post detail and updates it', async () => {
    vi.stubGlobal('fetch', vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url === '/api/admin/posts/1' && (!init?.method || init.method === 'GET')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            success: true,
            message: 'Success',
            data: {
              id: 1,
              title: 'Spring Boot Notes',
              summary: 'Old summary',
              contentMd: '# Old Title',
              contentHtml: '<h1>Old Title</h1>',
              status: 'DRAFT',
              categoryId: 1,
              categoryName: 'Java',
              tags: ['Spring Boot'],
              tagIds: [1],
              viewCount: 0,
              publishTime: null,
              previousPost: null,
              nextPost: null,
            },
          }),
        } as Response);
      }

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
            data: [{ id: 1, name: 'Spring Boot' }, { id: 2, name: 'Redis' }],
          }),
        } as Response);
      }

      if (url === '/api/admin/posts/1' && init?.method === 'PUT') {
        const headers = new Headers(init.headers);
        expect(headers.get('Authorization')).toBe('Bearer jwt-token');

        return Promise.resolve({
          ok: true,
          json: async () => ({
            success: true,
            message: 'Success',
            data: {
              id: 1,
              title: 'Spring Boot Notes Updated',
              summary: 'Updated summary',
              contentMd: '# Updated Title',
              contentHtml: '<h1>Updated Title</h1>',
              status: 'DRAFT',
              categoryId: 1,
              categoryName: 'Java',
              tags: ['Spring Boot', 'Redis'],
              tagIds: [1, 2],
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
      <MemoryRouter initialEntries={['/admin/posts/1/edit']}>
        <Routes>
          <Route path="/admin/posts/:id/edit" element={<AdminPostEdit />} />
          <Route path="/admin/posts" element={<div>后台文章管理</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText('文章标题')).toHaveValue('Spring Boot Notes');
    });

    fireEvent.change(screen.getByLabelText('文章标题'), { target: { value: 'Spring Boot Notes Updated' } });
    fireEvent.change(screen.getByLabelText('文章摘要'), { target: { value: 'Updated summary' } });
    fireEvent.change(screen.getByLabelText('Markdown 正文'), { target: { value: '# Updated Title' } });
    fireEvent.click(screen.getByLabelText('Redis'));
    fireEvent.click(screen.getByRole('button', { name: '保存修改' }));

    await waitFor(() => {
      expect(screen.getByText('后台文章管理')).toBeInTheDocument();
    });
  });
});
