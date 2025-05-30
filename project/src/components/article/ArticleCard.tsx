import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Eye, MessageCircle } from 'lucide-react';
import type { Article } from '../../types';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full flex flex-col"
      whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Link to={`/article/${article.slug}`} className="block">
        <div className="h-48 overflow-hidden">
          <img 
            src={article.thumbnail_url || 'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <Link to={`/article/${article.slug}`}>
            <h3 className="text-xl font-title text-gray-900 dark:text-white mb-2 hover:text-terracotta-600 dark:hover:text-terracotta-400">
              {article.title}
            </h3>
          </Link>
          
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
            <Calendar size={14} className="mr-1" />
            <span>{new Date(article.published_at || article.created_at).toLocaleDateString('zh-CN')}</span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 font-content mb-4 line-clamp-3">
            {article.excerpt}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <Link 
            to={`/articles?category=${article.category?.slug}`}
            className="bg-desert-100 dark:bg-desert-900 text-desert-800 dark:text-desert-200 text-xs px-2 py-1 rounded-full"
          >
            {article.category?.name || '未分类'}
          </Link>
          
          <div className="flex space-x-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Eye size={14} className="mr-1" />
              <span>{article.view_count}</span>
            </div>
            <div className="flex items-center">
              <MessageCircle size={14} className="mr-1" />
              <span>{article.comment_count}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ArticleCard;