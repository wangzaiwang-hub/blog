import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ARTICLES_SYNC } from '../../lib/articles';
import type { StaticArticle } from '../../types';

// 从文章数据中提取分类信息
const getCategories = () => {
  const categoryMap = new Map<string, {
    id: string;
    name: string;
    slug: string;
    article_count: number;
  }>();
  
  (ARTICLES_SYNC() as StaticArticle[]).forEach(article => {
    article.categories.forEach(category => {
      if (!categoryMap.has(category.slug)) {
        categoryMap.set(category.slug, {
          id: category.slug,
          name: category.name,
          slug: category.slug,
          article_count: 1
        });
      } else {
        const existing = categoryMap.get(category.slug)!;
        existing.article_count += 1;
      }
    });
  });
  
  return Array.from(categoryMap.values());
};

const CategoryList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category');
  const categories = getCategories();

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Link
        to="/articles"
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
          !currentCategory 
            ? 'bg-terracotta-500 text-white' 
            : 'bg-sand-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-terracotta-100 dark:hover:bg-terracotta-900'
        }`}
      >
        全部
      </Link>
      
      {categories.map((category) => (
        <motion.div
          key={category.id}
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Link
            to={`/articles?category=${category.slug}`}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
              currentCategory === category.slug 
                ? 'bg-terracotta-500 text-white' 
                : 'bg-sand-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-terracotta-100 dark:hover:bg-terracotta-900'
            }`}
          >
            {category.name} ({category.article_count})
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default CategoryList;