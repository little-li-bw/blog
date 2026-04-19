import { afterEach, describe, expect, it, vi } from 'vitest';
import { getCategories, getSiteConfig } from './site';

describe('site api', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('gets site config', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Success',
        data: {
          siteName: 'Bowen Blog',
          heroTitle: 'Java Backend Developer',
          heroSubtitle: 'Programming notes and technical practice',
          aboutMe: 'About me',
          skillsBackend: 'Java, Spring Boot',
          skillsFrontend: 'React',
          skillsDatabase: 'MySQL',
          skillsTools: 'Docker',
          email: 'bowen@example.com',
          githubUrl: 'https://github.com/bowen',
          resumeUrl: 'https://example.com/resume.pdf',
        },
      }),
    } as Response));

    const result = await getSiteConfig();

    expect(result.siteName).toBe('Bowen Blog');
    expect(result.email).toBe('bowen@example.com');
  });

  it('gets categories', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Success',
        data: [{ id: 1, name: 'Java', sort: 1 }],
      }),
    } as Response));

    const result = await getCategories();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Java');
  });
});
