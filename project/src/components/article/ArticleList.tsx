import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { getArticles } from '../../lib/articles';
import type { StaticArticle as Article } from '../../types';

interface ArticleListProps {
  limit?: number;
  paginated?: boolean;
  articlesPerPage?: number;
}

const ArticleList: React.FC<ArticleListProps> = ({ limit, paginated = false, articlesPerPage = 10 }) => {
    const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        const allArticles = await getArticles();
                if (limit) {
          setArticles(allArticles.slice(0, limit));
        } else {
          setArticles(allArticles);
        }
      } catch (error) {
        console.error('Error loading articles:', error);
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, [limit]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-terracotta-500"></div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-10">
        <p className="text-lg">暂无文章</p>
      </div>
    );
  }

    const totalPages = Math.ceil(articles.length / articlesPerPage);
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = paginated ? articles.slice(indexOfFirstArticle, indexOfLastArticle) : articles;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="space-y-6">
      {currentArticles.map((article, index) => (
        <motion.article
          key={article.slug}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <Link to={`/article/${article.slug}`} className="block p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {article.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {article.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                                {article.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded-full bg-terracotta-100 dark:bg-terracotta-900 text-terracotta-700 dark:text-terracotta-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <time className="text-sm text-gray-500 dark:text-gray-400">
                {format(new Date(article.date), 'PPP', { locale: zhCN })}
              </time>
            </div>
          </Link>
        </motion.article>
      ))}
      </div>
      {paginated && totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            上一页
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-4 py-2 border rounded-md text-sm font-medium ${
                currentPage === number 
                ? 'bg-terracotta-500 border-terracotta-500 text-white' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {number}
            </button>
          ))}

          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
};

export default ArticleList;