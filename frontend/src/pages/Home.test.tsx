import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Home from './Home';

describe('Home page', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders site config and posts from api', async () => {
    vi.stubGlobal('fetch', vi.fn((input: RequestInfo | URL) => {
      const url = String(input);

      if (url.endsWith('/api/site-config')) {
        return Promise.resolve({
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
        } as Response);
      }

      if (url.endsWith('/api/categories')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            success: true,
            message: 'Success',
            data: [{ id: 1, name: 'Java', sort: 1 }],
          }),
        } as Response);
      }

      return Promise.resolve({
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
      } as Response);
    }));

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Java Backend Developer')).toBeInTheDocument();
    });

    expect(screen.getByText('Spring Boot Notes')).toBeInTheDocument();
  });
});
