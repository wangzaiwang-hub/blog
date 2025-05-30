import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Article, getArticleBySlug } from '../utils/articles';

// @ts-ignore
import gfm from 'remark-gfm';
// @ts-ignore
import rehypeRaw from 'rehype-raw';
// @ts-ignore
import rehypeSanitize from 'rehype-sanitize';
// @ts-ignore
import rehypeHighlight from 'rehype-highlight';

export default function ArticleView() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (slug) {
      getArticleBySlug(slug).then(setArticle);
    }
  }, [slug]);

  if (!article) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-desert-600 dark:text-desert-400 font-content">文章加载中...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="inline-flex items-center text-terracotta-600 dark:text-terracotta-400 hover:text-terracotta-700 dark:hover:text-terracotta-300 mb-6">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回首页
      </Link>
      
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-title text-terracotta-600 dark:text-terracotta-400 mb-6 pb-3 border-b-4 border-terracotta-300">
          {article.title}
        </h1>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          发布于 {article.date}
        </div>
        
        <div className="article-content">
          <ReactMarkdown 
            remarkPlugins={[gfm]}
            rehypePlugins={[
              rehypeRaw, 
              rehypeSanitize, 
              rehypeHighlight
            ]}
            components={{
              h1: ({node, ...props}) => <h1 className="text-4xl font-bold text-terracotta-600 dark:text-terracotta-400 mb-6 pb-3 border-b-4 border-terracotta-300" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-3xl font-semibold text-terracotta-600 dark:text-terracotta-400 mb-5 pb-2 border-b-2 border-terracotta-300" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-2xl font-semibold text-terracotta-500 dark:text-terracotta-300 mb-4 pb-1 border-b border-terracotta-200" {...props} />,
              h4: ({node, ...props}) => <h4 className="text-xl font-medium text-terracotta-500 dark:text-terracotta-300 mb-3" {...props} />,
              h5: ({node, ...props}) => <h5 className="text-lg font-medium text-terracotta-400 dark:text-terracotta-200 mb-2" {...props} />,
              h6: ({node, ...props}) => <h6 className="text-base font-medium text-terracotta-300 dark:text-terracotta-100 mb-2" {...props} />,
              p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-base" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-terracotta-400 pl-4 py-2 my-4 bg-sand-50 dark:bg-gray-800 italic text-gray-600 dark:text-gray-300" {...props} />,
              code: ({node, ...props}) => <code className="bg-sand-100 dark:bg-gray-700 text-terracotta-600 dark:text-terracotta-300 px-1.5 py-0.5 rounded-md text-sm font-mono" {...props} />,
              pre: ({node, ...props}) => <pre className="bg-sand-50 dark:bg-gray-800 p-4 rounded-lg my-4 overflow-x-auto border border-sand-200 dark:border-gray-700 shadow-md" {...props} />,
              a: ({node, ...props}) => <a className="text-terracotta-600 dark:text-terracotta-400 hover:text-terracotta-700 dark:hover:text-terracotta-300 transition-colors duration-300 border-b-2 border-transparent hover:border-terracotta-500" {...props} />,
              img: ({node, ...props}) => <img className="max-w-full rounded-lg my-4 shadow-md hover:shadow-xl transition-shadow duration-300" {...props} />,
              ul: ({node, ...props}) => <ul className="pl-6 mb-4 space-y-2" {...props} />,
              ol: ({node, ...props}) => <ol className="pl-6 mb-4 space-y-2" {...props} />,
              li: ({node, ...props}) => <li className="relative pl-4 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-terracotta-500 before:rounded-full" {...props} />,
              strong: ({node, ...props}) => <strong className="font-bold text-terracotta-600 dark:text-terracotta-400" {...props} />,
              em: ({node, ...props}) => <em className="italic text-terracotta-500 dark:text-terracotta-300" {...props} />,
              hr: ({node, ...props}) => <hr className="my-6 border-t-2 border-terracotta-200 dark:border-terracotta-700 opacity-50" {...props} />
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
} 