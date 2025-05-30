/*
  # Initial Schema Setup for Desert Eagle Blog

  1. Tables
    - `profiles` - User profiles with authentication link
    - `articles` - Blog articles with content and metadata
    - `categories` - Article categories
    - `tags` - Article tags
    - `article_tags` - Junction table for articles and tags
    - `comments` - Article comments with nesting support
    - `music` - Background music tracks
    - `projects` - Personal projects showcase
    - `skills` - Skills for about page

  2. Security
    - Enable Row Level Security on all tables
    - Add appropriate policies for reading and writing data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text NOT NULL UNIQUE,
  avatar_url text,
  bio text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  is_admin boolean NOT NULL DEFAULT false,
  email text NOT NULL UNIQUE
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  article_count integer NOT NULL DEFAULT 0
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert categories"
  ON categories
  FOR INSERT
  WITH CHECK ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Only admins can update categories"
  ON categories
  FOR UPDATE
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL,
  excerpt text NOT NULL,
  category_id uuid NOT NULL REFERENCES categories(id),
  author_id uuid NOT NULL REFERENCES profiles(id),
  thumbnail_url text,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  view_count integer NOT NULL DEFAULT 0,
  comment_count integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published articles are viewable by everyone"
  ON articles
  FOR SELECT
  USING (is_published = true OR auth.uid() = author_id);

CREATE POLICY "Authors can create articles"
  ON articles
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own articles"
  ON articles
  FOR UPDATE
  USING (auth.uid() = author_id OR (SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  article_count integer NOT NULL DEFAULT 0
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tags are viewable by everyone"
  ON tags
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert tags"
  ON tags
  FOR INSERT
  WITH CHECK ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- Create article_tags junction table
CREATE TABLE IF NOT EXISTS article_tags (
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Article tags are viewable by everyone"
  ON article_tags
  FOR SELECT
  USING (true);

CREATE POLICY "Authors can add tags to their articles"
  ON article_tags
  FOR INSERT
  WITH CHECK (
    auth.uid() = (SELECT author_id FROM articles WHERE id = article_id) OR
    (SELECT is_admin FROM profiles WHERE id = auth.uid())
  );

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone"
  ON comments
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert comments"
  ON comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON comments
  FOR UPDATE
  USING (auth.uid() = user_id OR (SELECT is_admin FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete their own comments"
  ON comments
  FOR DELETE
  USING (auth.uid() = user_id OR (SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- Create music table
CREATE TABLE IF NOT EXISTS music (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  artist text NOT NULL,
  url text NOT NULL,
  cover_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE music ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Music is viewable by everyone"
  ON music
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert music"
  ON music
  FOR INSERT
  WITH CHECK ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  url text NOT NULL,
  image_url text,
  github_url text,
  tech_stack text[] NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are viewable by everyone"
  ON projects
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert projects"
  ON projects
  FOR INSERT
  WITH CHECK ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  level integer NOT NULL,
  category text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Skills are viewable by everyone"
  ON skills
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert skills"
  ON skills
  FOR INSERT
  WITH CHECK ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- Create functions and triggers
-- Update article count in categories when articles are added/removed
CREATE OR REPLACE FUNCTION update_category_article_count() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE categories SET article_count = article_count + 1 WHERE id = NEW.category_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE categories SET article_count = article_count - 1 WHERE id = OLD.category_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.category_id <> NEW.category_id THEN
    UPDATE categories SET article_count = article_count - 1 WHERE id = OLD.category_id;
    UPDATE categories SET article_count = article_count + 1 WHERE id = NEW.category_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_category_count
AFTER INSERT OR UPDATE OR DELETE ON articles
FOR EACH ROW EXECUTE FUNCTION update_category_article_count();

-- Update tag article count when article_tags are added/removed
CREATE OR REPLACE FUNCTION update_tag_article_count() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tags SET article_count = article_count + 1 WHERE id = NEW.tag_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tags SET article_count = article_count - 1 WHERE id = OLD.tag_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tag_count
AFTER INSERT OR DELETE ON article_tags
FOR EACH ROW EXECUTE FUNCTION update_tag_article_count();