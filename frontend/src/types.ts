export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  nickname: string;
}

export interface SiteConfig {
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutMe: string;
  skillsBackend: string;
  skillsFrontend: string;
  skillsDatabase: string;
  skillsTools: string;
  email: string;
  githubUrl: string;
  resumeUrl: string;
}

export interface Category {
  id: number;
  name: string;
  sort: number;
}

export interface TagOption {
  id: number;
  name: string;
}

export interface PostListItem {
  id: number;
  title: string;
  summary: string;
  status: string;
  categoryId: number;
  categoryName: string;
  tags: string[];
  viewCount: number;
  publishTime?: string;
}

export interface PostPrevNext {
  id: number;
  title: string;
}

export interface PostDetail {
  id: number;
  title: string;
  summary: string;
  contentHtml: string;
  status: string;
  categoryId: number;
  categoryName: string;
  tags: string[];
  viewCount: number;
  publishTime?: string;
  previousPost: PostPrevNext | null;
  nextPost: PostPrevNext | null;
}

export interface AdminPostSavePayload {
  title: string;
  summary: string;
  contentMd: string;
  categoryId: number;
  tagIds: number[];
}
