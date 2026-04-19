import { adminApiRequest } from './client';
import type { Category, TagOption } from '../types';

export function getAdminCategories(token: string): Promise<Category[]> {
  return adminApiRequest<Category[]>('/api/admin/categories', token);
}

export function createAdminCategory(token: string, payload: { name: string; sort: number }): Promise<Category> {
  return adminApiRequest<Category>('/api/admin/categories', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function deleteAdminCategory(token: string, id: number): Promise<void> {
  return adminApiRequest<void>(`/api/admin/categories/${id}`, token, {
    method: 'DELETE',
  });
}

export function getAdminTags(token: string): Promise<TagOption[]> {
  return adminApiRequest<TagOption[]>('/api/admin/tags', token);
}

export function createAdminTag(token: string, payload: { name: string }): Promise<TagOption> {
  return adminApiRequest<TagOption>('/api/admin/tags', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function deleteAdminTag(token: string, id: number): Promise<void> {
  return adminApiRequest<void>(`/api/admin/tags/${id}`, token, {
    method: 'DELETE',
  });
}
