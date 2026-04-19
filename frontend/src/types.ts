export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  category: string;
  tags: string[];
  readTime: string;
  views: number;
  isFeatured?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  responsibilities: string[];
  highlights: string[];
  githubUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  date: string;
}
