import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AdminCategories from './AdminCategories';

describe('AdminCategories page', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('blog_admin_token', 'jwt-token');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads categories and supports create/delete actions', async () => {
    let categories = [
      { id: 1, name: 'Java', sort: 1 },
    ];

    vi.stubGlobal('fetch', vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const headers = new Headers(init?.headers);

      if (url === '/api/admin/categories' && (!init?.method || init.method === 'GET')) {
        expect(headers.get('Authorization')).toBe('Bearer jwt-token');
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, message: 'Success', data: categories }),
        } as Response);
      }

      if (url === '/api/admin/categories' && init?.method === 'POST') {
        categories = [
          ...categories,
          { id: 2, name: 'Spring', sort: 2 },
        ];
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, message: 'Success', data: categories[1] }),
        } as Response);
      }

      if (url === '/api/admin/categories/2' && init?.method === 'DELETE') {
        categories = categories.filter((item) => item.id !== 2);
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, message: 'Deleted successfully', data: null }),
        } as Response);
      }

      throw new Error(`Unexpected request: ${url}`);
    }));

    render(
      <MemoryRouter>
        <AdminCategories />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Java')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('分类名称'), { target: { value: 'Spring' } });
    fireEvent.change(screen.getByLabelText('排序'), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: '新增分类' }));

    await waitFor(() => {
      expect(screen.getByText('Spring')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: '删除 Spring' }));

    await waitFor(() => {
      expect(screen.queryByText('Spring')).not.toBeInTheDocument();
    });
  });
});
