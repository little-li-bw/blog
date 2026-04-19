import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Layout from './Layout';

describe('Layout', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders navigation and footer data from site config', async () => {
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

    render(
      <MemoryRouter>
        <Layout>
          <div>content</div>
        </Layout>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('bowen@example.com')).toBeInTheDocument();
    });

    expect(screen.getByRole('link', { name: /GitHub/i })).toHaveAttribute('href', 'https://github.com/bowen');
    expect(screen.getByText('content')).toBeInTheDocument();
  });
});
