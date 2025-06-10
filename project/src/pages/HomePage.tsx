import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Layout from '../components/layout/Layout';
import MusicAvatar from '../components/home/MusicAvatar';
import TagCloud from '../components/home/TagCloud';
import ArticleList from '../components/article/ArticleList';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <div className="relative bg-gradient-to-b from-desert-100 to-sand-100 dark:from-gray-800 dark:to-gray-900 pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-title text-terracotta-600 dark:text-terracotta-400 mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              沙漠一只雕
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl font-content text-gray-700 dark:text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              在技术的沙漠中翱翔，记录学习与探索的足迹
            </motion.p>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-1/3 lg:w-1/4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <div className="flex flex-col items-center mb-8">
                  <MusicAvatar />
                  <h2 className="text-xl font-bold mb-2">关于我</h2>
                </div>
                <TagCloud />
              </div>
            </aside>
            <main className="flex-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-title text-gray-900 dark:text-white">最新文章</h2>
                  <Link 
                    to="/articles" 
                    className="flex items-center text-terracotta-600 dark:text-terracotta-400 hover:text-terracotta-700 dark:hover:text-terracotta-300 text-sm font-medium"
                  >
                    查看全部 <ChevronRight size={16} />
                  </Link>
                </div>
                <ArticleList limit={7} />
              </div>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;