import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { getArticles, Article } from '../../lib/articles';

interface ArticleListProps {
  limit?: number;
}

const ArticleList: React.FC<ArticleListProps> = ({ limit = 6 }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        const allArticles = await getArticles();
        setArticles(allArticles.slice(0, limit));
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

  return (
    <div className="space-y-6">
      {articles.map((article, index) => (
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
                {article.tags.map(tag => (
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
  );
};

export default ArticleList;