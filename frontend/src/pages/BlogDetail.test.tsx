import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import BlogDetail from './BlogDetail';

describe('BlogDetail page', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders post detail from api', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
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
      }),
    );

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

    const article = screen.getByRole('article');
    expect(article.className).toContain('max-w-5xl');
    expect(article.className).toContain('mx-auto');

    const tocHeading = screen.getByRole('heading', { name: /目录导航/ });
    const aside = tocHeading.closest('aside');
    expect(aside?.className).toContain('lg:absolute');
    expect(aside?.className).toContain('lg:right-0');
  });

  it('marks fenced code blocks separately from inline code', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
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
              title: 'Code Sample',
              summary: 'Summary',
              contentHtml:
                '<pre><code class="language-java">System.out.println(&quot;hello&quot;);</code></pre><p><code>inline()</code></p>',
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
      }),
    );

    render(
      <MemoryRouter initialEntries={['/blog/1']}>
        <Routes>
          <Route path="/blog/:id" element={<BlogDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Code Sample')).toBeInTheDocument();
    });

    const article = screen.getByRole('article');
    const codeBlock = article.querySelector('pre');
    expect(codeBlock).toHaveAttribute('data-code-block', 'true');
    expect(codeBlock?.querySelector('code')).toHaveAttribute('data-inline-code', 'false');

    expect(screen.getByText('inline()')).toHaveAttribute('data-inline-code', 'true');
  });

  it('adds simple syntax color tokens for java code blocks', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
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
              title: 'Java Highlight',
              summary: 'Summary',
              contentHtml:
                '<pre><code class="language-java">@Data\npublic class Demo {\n  private String name = &quot;hi&quot;;\n  // comment\n}</code></pre>',
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
      }),
    );

    render(
      <MemoryRouter initialEntries={['/blog/1']}>
        <Routes>
          <Route path="/blog/:id" element={<BlogDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Java Highlight')).toBeInTheDocument();
    });

    const article = screen.getByRole('article');
    expect(article.querySelector('[data-token="annotation"]')?.textContent).toBe('@Data');
    expect(article.querySelector('[data-token="keyword"]')?.textContent).toBe('public');
    expect(article.querySelector('[data-token="type"]')?.textContent).toBe('Demo');
    expect(article.querySelector('[data-token="string"]')?.textContent).toBe('"hi"');
    expect(article.querySelector('[data-token="comment"]')?.textContent).toContain('// comment');
  });
});
