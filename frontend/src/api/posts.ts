import type { PostDetail, PostListItem } from '../types';
import { apiRequest } from './client';

interface GetPostsOptions {
  pageNum?: number;
  pageSize?: number;
}

export function getPosts(options: GetPostsOptions = {}): Promise<PostListItem[]> {
  const params = new URLSearchParams();
  params.set('pageNum', String(options.pageNum ?? 1));
  params.set('pageSize', String(options.pageSize ?? 100));
  return apiRequest<PostListItem[]>(`/api/posts?${params.toString()}`);
}

export function getPostDetail(id: number): Promise<PostDetail> {
  return apiRequest<PostDetail>(`/api/posts/${id}`);
}

export function incrementPostViews(id: number): Promise<number> {
  return apiRequest<number>(`/api/posts/${id}/views`, {
    method: 'POST',
  });
}
