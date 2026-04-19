import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import BlogDetail from './BlogDetail';

describe('BlogDetail page', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders post detail from api', async () => {
    vi.stubGlobal('fetch', vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (init?.method === 'POST' && url.endsWith('/api/posts/1/views')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, message: 'Success', data: 13 }),
        } as Response);
      }

      return Promise.resolve({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Success',
          data: {
            id: 1,
            title: 'Spring Boot Notes',
            summary: 'Summary',
            contentHtml: '<h1>Title</h1><p>Body</p>',
            status: 'PUBLISHED',
            categoryId: 1,
            categoryName: 'Java',
            tags: ['Spring Boot'],
            viewCount: 12,
            publishTime: '2026-04-19T12:00:00',
            previousPost: null,
            nextPost: null,
          },
        }),
      } as Response);
    }));

    render(
      <MemoryRouter initialEntries={['/blog/1']}>
        <Routes>
          <Route path="/blog/:id" element={<BlogDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Spring Boot Notes')).toBeInTheDocument();
    });

    expect(screen.getByText('Body')).toBeInTheDocument();
  });
});
