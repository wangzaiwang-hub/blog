export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  is_admin: boolean;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category_id: string;
  author_id: string;
  thumbnail_url?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  comment_count: number;
  is_published: boolean;
  author?: User;
  category?: Category;
  tags?: Tag[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  article_count: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  article_count: number;
}

export interface Comment {
  id: string;
  content: string;
  article_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  user?: User;
  article?: Article;
  parent_id?: string;
  replies?: Comment[];
}

export interface Music {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover_url: string;
}

export interface Skill {
  name: string;
  level: number;
  category: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  image_url?: string;
  github_url?: string;
  tech_stack: string[];
}

export interface StaticArticle {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  content: string;
  categories: Category[];
  formattedDate: string; // Added for display
}