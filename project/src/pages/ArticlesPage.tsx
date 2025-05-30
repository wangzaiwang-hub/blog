import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import ArticleList from '../components/article/ArticleList';
import CategoryList from '../components/article/CategoryList';
import { supabase } from '../lib/supabase';
import { Book } from 'lucide-react';

const ArticlesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category');
  const tagSlug = searchParams.get('tag');
  const [categoryId, setCategoryId] = React.useState<string | undefined>(undefined);
  const [tagId, setTagId] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchFilters = async () => {
      setLoading(true);
      
      if (categorySlug) {
        const { data } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', categorySlug)
          .single();
          
        if (data) {
          setCategoryId(data.id);
        }
      } else {
        setCategoryId(undefined);
      }
      
      if (tagSlug) {
        const { data } = await supabase
          .from('tags')
          .select('id')
          .eq('slug', tagSlug)
          .single();
          
        if (data) {
          setTagId(data.id);
        }
      } else {
        setTagId(undefined);
      }
      
      setLoading(false);
    };
    
    fetchFilters();
  }, [categorySlug, tagSlug]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex justify-center items-center w-16 h-16 bg-desert-100 dark:bg-desert-900 rounded-full mb-4">
            <Book size={32} className="text-desert-800 dark:text-desert-200" />
          </div>
          <h1 className="text-3xl md:text-4xl font-title text-gray-900 dark:text-white mb-4">
            {categorySlug ? '分类文章' : tagSlug ? '标签文章' : '所有文章'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {categorySlug 
              ? `浏览「${categorySlug}」分类下的所有文章` 
              : tagSlug 
                ? `浏览「${tagSlug}」标签下的所有文章`
                : '探索各种主题的文章，分享技术心得与生活感悟'
            }
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CategoryList />
          
          <ArticleList 
            categoryId={categoryId} 
            tagId={tagId} 
          />
        </motion.div>
      </div>
    </Layout>
  );
};

export default ArticlesPage;