import matter from 'gray-matter';
import { format } from 'date-fns';
import { Buffer } from 'buffer';

// 确保全局 Buffer 可用
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

export interface Article {
  slug: string;
  title: string;
  date: string;
  content: string;
  excerpt: string;
}

export async function getArticles(): Promise<Article[]> {
  const articles = await Promise.all(
    Object.entries(import.meta.glob('/public/articles/*.md', { as: 'raw' }))
      .map(async ([path, loadArticle]) => {
        const content = await loadArticle();
        const slug = path.replace('/public/articles/', '').replace('.md', '');
        const { data, content: markdown } = matter(content);
        
        return {
          slug,
          title: data.title || slug,
          date: data.date ? format(new Date(data.date), 'yyyy-MM-dd') : '',
          content: markdown,
          excerpt: markdown.slice(0, 200) + '...'
        };
      })
  );

  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getArticles();
  return articles.find(article => article.slug === slug) || null;
} 