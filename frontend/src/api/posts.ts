import type { AdminPostSavePayload, PostDetail, PostListItem } from '../types';
import { adminApiRequest, apiRequest } from './client';

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

export function createAdminPost(token: string, payload: AdminPostSavePayload): Promise<PostDetail> {
  return adminApiRequest<PostDetail>('/api/admin/posts', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateAdminPostStatus(token: string, id: number, status: string): Promise<PostDetail> {
  return adminApiRequest<PostDetail>(`/api/admin/posts/${id}/status`, token, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}
