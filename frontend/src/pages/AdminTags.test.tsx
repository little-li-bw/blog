import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AdminTags from './AdminTags';

describe('AdminTags page', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('blog_admin_token', 'jwt-token');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads tags and supports create/delete actions', async () => {
    let tags = [
      { id: 1, name: 'Spring Boot' },
    ];

    vi.stubGlobal('fetch', vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const headers = new Headers(init?.headers);

      if (url === '/api/admin/tags' && (!init?.method || init.method === 'GET')) {
        expect(headers.get('Authorization')).toBe('Bearer jwt-token');
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, message: 'Success', data: tags }),
        } as Response);
      }

      if (url === '/api/admin/tags' && init?.method === 'POST') {
        tags = [
          ...tags,
          { id: 2, name: 'Redis' },
        ];
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, message: 'Success', data: tags[1] }),
        } as Response);
      }

      if (url === '/api/admin/tags/2' && init?.method === 'DELETE') {
        tags = tags.filter((item) => item.id !== 2);
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, message: 'Deleted successfully', data: null }),
        } as Response);
      }

      throw new Error(`Unexpected request: ${url}`);
    }));

    render(
      <MemoryRouter>
        <AdminTags />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Spring Boot')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('标签名称'), { target: { value: 'Redis' } });
    fireEvent.click(screen.getByRole('button', { name: '新增标签' }));

    await waitFor(() => {
      expect(screen.getByText('Redis')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: '删除 Redis' }));

    await waitFor(() => {
      expect(screen.queryByText('Redis')).not.toBeInTheDocument();
    });
  });
});
