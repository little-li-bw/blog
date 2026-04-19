import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPostDetail, getPosts, incrementPostViews } from './posts';

describe('posts api', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('gets posts list', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
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
    } as Response));

    const result = await getPosts();

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Spring Boot Notes');
  });

  it('gets post detail', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Success',
        data: {
          id: 1,
          title: 'Spring Boot Notes',
          summary: 'Summary',
          contentHtml: '<h1>Title</h1>',
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
    } as Response));

    const result = await getPostDetail(1);

    expect(result.title).toBe('Spring Boot Notes');
    expect(result.contentHtml).toContain('<h1>');
  });

  it('increments post views', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Success',
        data: 13,
      }),
    } as Response));

    const result = await incrementPostViews(1);

    expect(result).toBe(13);
  });
});
