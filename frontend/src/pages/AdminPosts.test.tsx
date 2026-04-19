import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AdminPosts from './AdminPosts';

describe('AdminPosts page', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('blog_admin_token', 'jwt-token');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads admin posts with auth token', async () => {
    const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      expect(String(input)).toBe('/api/admin/posts');
      const headers = new Headers(init?.headers);
      expect(headers.get('Authorization')).toBe('Bearer jwt-token');

      return Promise.resolve({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Success',
          data: [
            {
              id: 1,
              title: 'Spring Boot Notes',
              summary: 'Summary',
              status: 'PUBLISHED',
              categoryId: 1,
              categoryName: 'Java',
              tags: ['Spring Boot'],
              viewCount: 12,
              publishTime: '2026-04-19T12:00:00',
            },
          ],
        }),
      } as Response);
    });

    vi.stubGlobal('fetch', fetchMock);

    render(
      <MemoryRouter>
        <AdminPosts />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Spring Boot Notes')).toBeInTheDocument();
    });

    expect(screen.getByText('PUBLISHED')).toBeInTheDocument();
  });

  it('publishes draft post from list', async () => {
    vi.stubGlobal('fetch', vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url === '/api/admin/posts') {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            success: true,
            message: 'Success',
            data: [
              {
                id: 1,
                title: 'Draft Post',
                summary: 'Summary',
                status: 'DRAFT',
                categoryId: 1,
                categoryName: 'Java',
                tags: ['Spring Boot'],
                viewCount: 0,
                publishTime: null,
              },
            ],
          }),
        } as Response);
      }

      if (url === '/api/admin/posts/1/status') {
        const headers = new Headers(init?.headers);
        expect(headers.get('Authorization')).toBe('Bearer jwt-token');
        expect(init?.method).toBe('PUT');

        return Promise.resolve({
          ok: true,
          json: async () => ({
            success: true,
            message: 'Success',
            data: {
              id: 1,
              title: 'Draft Post',
              summary: 'Summary',
              contentHtml: '<p>Body</p>',
              status: 'PUBLISHED',
              categoryId: 1,
              categoryName: 'Java',
              tags: ['Spring Boot'],
              viewCount: 0,
              publishTime: '2026-04-19T12:00:00',
              previousPost: null,
              nextPost: null,
            },
          }),
        } as Response);
      }

      throw new Error(`Unexpected request: ${url}`);
    }));

    render(
      <MemoryRouter>
        <AdminPosts />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Draft Post')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: '发布' }));

    await waitFor(() => {
      expect(screen.getByText('PUBLISHED')).toBeInTheDocument();
    });
  });
});
