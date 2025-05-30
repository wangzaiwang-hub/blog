import matter from 'gray-matter';
// 移除 fs 和 path 的导入，因为 Vite 的 import.meta.glob 可以在客户端处理
// import fs from 'fs';
// import path from 'path';
import type { StaticArticle, Category } from '../types';
import { format, parseISO } from 'date-fns';

let hasLoggedRawContent = false;

function generateSlug(name: string): string {
  if (!name) return '';
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
} // Module-level variable for one-time logging

// 移除硬编码的 ARTICLES 数组
// export const ARTICLES: StaticArticle[] = [ ... ];

export async function getArticles(): Promise<StaticArticle[]> {
  console.log('[articles.ts] getArticles called');
  try {
  const articleModules = import.meta.glob('/markdown_files/**/*.md', { eager: true, query: '?raw', import: 'default' });
  console.log('[articles.ts] articleModules loaded:', articleModules);
  const articles: StaticArticle[] = [];

  for (const filePath in articleModules) {
    const rawContent = articleModules[filePath] as string;
    let frontmatter, markdownContent;
    try {
      // Log raw content for the first file encountered for brevity in logs
      if (!hasLoggedRawContent) {
        console.log(`[articles.ts] Raw content for ${filePath}:\n`, rawContent);
        hasLoggedRawContent = true;
      }
      const parsed = matter(rawContent);
      frontmatter = parsed.data;
      markdownContent = parsed.content;
    } catch (e) {
      console.error(`[articles.ts] Error parsing frontmatter for ${filePath}:`, e, JSON.stringify(e, Object.getOwnPropertyNames(e)));
      // If you want to log rawContent for each error, reset here, but it can be very verbose.
      // hasLoggedRawContent = false;
      continue; // Skip this file
    }

    // 从文件路径中提取 slug
    // 例如 /public/articles/my-post.md -> my-post
    const slug = filePath
      .replace('/markdown_files/', '')
      .replace(/\.md$/, '');

    if (!frontmatter.title || !frontmatter.date) {
      console.warn(`Skipping ${filePath} due to missing title or date in frontmatter.`);
      continue;
    }
    
    console.log(`[articles.ts] Processing article: '${frontmatter.title}', Date value: '${frontmatter.date}', Date type: ${typeof frontmatter.date}`);

    // Date Handling
    let dateForInterface: string = '';
    let formattedDateForDisplay: string = 'Invalid Date';

    if (typeof frontmatter.date === 'string' && frontmatter.date.trim() !== '') {
      dateForInterface = frontmatter.date;
      try {
        const parsedDate = parseISO(dateForInterface);
        formattedDateForDisplay = format(parsedDate, 'yyyy-MM-dd');
      } catch (e) {
        console.error(`[articles.ts] Error parsing date string '${dateForInterface}' for article '${frontmatter.title}':`, e);
      }
    } else if (frontmatter.date instanceof Date && !isNaN(frontmatter.date.getTime())) {
      const dateObj = frontmatter.date;
      dateForInterface = dateObj.toISOString(); // Store as ISO string
      try {
        formattedDateForDisplay = format(dateObj, 'yyyy-MM-dd');
      } catch (e) {
        console.error(`[articles.ts] Error formatting pre-parsed Date for article '${frontmatter.title}':`, e);
      }
    } else {
      console.warn(`[articles.ts] Invalid or missing date for article '${frontmatter.title}': Value: `, frontmatter.date);
      dateForInterface = new Date(0).toISOString(); // Default to epoch ISO string
    }

    // Category Handling
    let articleCategories: Category[] = [];
    const fmCategory = frontmatter.category || frontmatter.categories;
    if (typeof fmCategory === 'string' && fmCategory.trim() !== '') {
      const slug = generateSlug(fmCategory);
      articleCategories = [{ id: slug, name: fmCategory, slug, description: '', article_count:0 }];
    } else if (Array.isArray(fmCategory)) {
      articleCategories = fmCategory
        .filter(cat => typeof cat === 'string' && cat.trim() !== '')
        .map(catName => {
          const slug = generateSlug(catName);
          return { id: slug, name: catName, slug, description: '', article_count:0 };
        });
    }

    const article: StaticArticle = {
      slug,
      title: frontmatter.title || 'Untitled Article',
      excerpt: frontmatter.excerpt || frontmatter.description || '', // Prioritize excerpt, then description
      date: dateForInterface,
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags.filter((tag: any) => typeof tag === 'string') : [],
      content: markdownContent || '',
      categories: articleCategories,
      formattedDate: formattedDateForDisplay,
    };

    articles.push(article);
  }

  // 按日期降序排序
  const sortedArticles = articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  console.log(`[articles.ts] getArticles successfully processed ${sortedArticles.length} articles.`);
  return sortedArticles;
  } catch (error) {
    console.error('[articles.ts] Error in getArticles:', error, JSON.stringify(error, Object.getOwnPropertyNames(error)));
    throw error; // Re-throw the error to be caught by the caller if necessary
  }
}

export async function getArticleBySlug(slug: string): Promise<StaticArticle | undefined> {
  const articles = await getArticles();
  return articles.find(article => article.slug === slug);
}

// 保留一个 ARTICES 变量以供 CategoryList.tsx 等可能直接引用的地方使用
// 这将在首次调用 getArticles 后被填充
// 注意：这可能不是最佳实践，理想情况下，所有组件都应异步获取文章
let LOADED_ARTICLES: StaticArticle[] = [];

export async function ensureArticlesLoaded(): Promise<StaticArticle[]> {
  console.log('[articles.ts] ensureArticlesLoaded called. LOADED_ARTICLES length:', LOADED_ARTICLES.length);
  if (LOADED_ARTICLES.length === 0) {
    console.log('[articles.ts] LOADED_ARTICLES is empty, calling getArticles...');
    LOADED_ARTICLES = await getArticles();
    console.log('[articles.ts] getArticles finished. LOADED_ARTICLES length:', LOADED_ARTICLES.length, LOADED_ARTICLES.map(a => a.title));
  }
  return LOADED_ARTICLES;
}

// 为 CategoryList.tsx 等组件提供同步访问的 ARTICLES (在初次加载后)
// 考虑修改 CategoryList.tsx 以异步获取数据，从而移除此变量
export const ARTICLES_SYNC = () => {
    console.log('[articles.ts] ARTICLES_SYNC called. LOADED_ARTICLES length:', LOADED_ARTICLES.length);
    if (LOADED_ARTICLES.length === 0) {
        console.warn("ARTICLES_SYNC accessed before articles are loaded. Call ensureArticlesLoaded() first or use getArticles() for async access.");
        // 返回空数组或抛出错误，取决于期望行为
        // 为了减少破坏性更改，暂时返回空数组
        return [];
    }
    return LOADED_ARTICLES;
};

// 示例：在应用启动时或相关组件挂载时预加载文章
// (例如在 main.tsx 或 App.tsx)
// ensureArticlesLoaded().then(() => {
//   console.log("Articles preloaded for synchronous access if needed.");
// }); 