import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Mail, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-sand-200 dark:bg-gray-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-title text-terracotta-600 dark:text-terracotta-400 mb-4">
              沙漠一只雕
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 font-content">
              记录技术与生活的点滴，分享学习与创造的乐趣。
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/wangzaiwang-hub" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-terracotta-500 dark:hover:text-terracotta-400"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://mail.google.com/mail/?view=cm&fs=1&to=junqianxi.hub@gmail.com" 
                className="text-gray-600 dark:text-gray-400 hover:text-terracotta-500 dark:hover:text-terracotta-400"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-600 dark:text-gray-300 hover:text-terracotta-500 dark:hover:text-terracotta-400"
                >
                  首页
                </Link>
              </li>
              <li>
                <Link 
                  to="/articles" 
                  className="text-gray-600 dark:text-gray-300 hover:text-terracotta-500 dark:hover:text-terracotta-400"
                >
                  文章
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-600 dark:text-gray-300 hover:text-terracotta-500 dark:hover:text-terracotta-400"
                >
                  关于
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">分类</h3>
            <div className="flex flex-wrap gap-2">
              <Link 
                to="/articles?category=tech" 
                className="px-3 py-1 bg-sand-300 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-terracotta-100 dark:hover:bg-terracotta-900"
              >
                项目
              </Link>
              <Link 
                to="/articles?category=life" 
                className="px-3 py-1 bg-sand-300 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-terracotta-100 dark:hover:bg-terracotta-900"
              >
                技术
              </Link>
              <Link 
                to="/articles?category=coding" 
                className="px-3 py-1 bg-sand-300 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-terracotta-100 dark:hover:bg-terracotta-900"
              >
                设计
              </Link>
              <Link 
                to="/articles?category=design" 
                className="px-3 py-1 bg-sand-300 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-terracotta-100 dark:hover:bg-terracotta-900"
              >
                博客
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} 沙漠一只雕. All rights reserved.
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center mt-2 md:mt-0">
            Made with <Heart size={14} className="mx-1 text-terracotta-500" /> using React & Supabase
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;