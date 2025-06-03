import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { marked } from 'marked';
import Layout from '../components/layout/Layout';
import { ARTICLES_SYNC } from '../lib/articles';

// 配置 marked 选项
marked.setOptions({
  breaks: true, // 支持 GitHub 风格的换行
  gfm: true, // 启用 GitHub 风格的 Markdown
});

const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = ARTICLES_SYNC().find(article => article.slug === slug);

  if (!article) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-desert-100 to-sand-100 dark:from-gray-800 dark:to-gray-900 py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl font-title text-terracotta-600 dark:text-terracotta-400 mb-4">
                文章未找到
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                无法找到请求的文章，请返回首页浏览其他内容
              </p>
              <Link 
                to="/" 
                className="inline-block bg-terracotta-500 hover:bg-terracotta-600 text-white px-6 py-2 rounded-md transition-colors duration-200"
              >
                返回首页
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // 将 Markdown 转换为 HTML
  const contentHtml = marked(article.content);

  return (
    <Layout>
      <article className="min-h-screen bg-gradient-to-b from-desert-100 to-sand-100 dark:from-gray-800 dark:to-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <header className="mb-8">
            <h1 className="text-4xl font-title text-terracotta-600 dark:text-terracotta-400 mb-4">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime={article.date}>
                {article.date}
              </time>
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded-full bg-terracotta-100 dark:bg-terracotta-900 text-terracotta-700 dark:text-terracotta-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </header>
          <div 
            className="article-content prose prose-sand dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
          
          <div className="flex justify-center mt-12 mb-8">
            <Link 
              to="/articles" 
              className="inline-flex items-center bg-terracotta-500 hover:bg-terracotta-600 text-white px-6 py-3 rounded-md transition-colors duration-200 text-lg font-medium"
            >
              ← 返回文章列表
            </Link>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default ArticleDetailPage;