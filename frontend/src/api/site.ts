import type { Category, SiteConfig, TagOption } from '../types';
import { adminApiRequest, apiRequest } from './client';

export function getSiteConfig(): Promise<SiteConfig> {
  return apiRequest<SiteConfig>('/api/site-config');
}

export function getCategories(): Promise<Category[]> {
  return apiRequest<Category[]>('/api/categories');
}

export function getTags(): Promise<TagOption[]> {
  return apiRequest<TagOption[]>('/api/tags');
}

export function getAdminSiteConfig(token: string): Promise<SiteConfig> {
  return adminApiRequest<SiteConfig>('/api/admin/site-config', token);
}

export function updateAdminSiteConfig(token: string, payload: SiteConfig): Promise<SiteConfig> {
  return adminApiRequest<SiteConfig>('/api/admin/site-config', token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
