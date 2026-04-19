import type { Category, SiteConfig, TagOption } from '../types';
import { apiRequest } from './client';

export function getSiteConfig(): Promise<SiteConfig> {
  return apiRequest<SiteConfig>('/api/site-config');
}

export function getCategories(): Promise<Category[]> {
  return apiRequest<Category[]>('/api/categories');
}

export function getTags(): Promise<TagOption[]> {
  return apiRequest<TagOption[]>('/api/tags');
}
