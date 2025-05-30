import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Moon, Sun, Home, FileText, User, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../lib/context/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import LoginModal from '../auth/LoginModal';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const location = useLocation();
  
  const navLinks = [
    { name: '首页', path: '/', icon: <Home size={20} /> },
    { name: '文章', path: '/articles', icon: <FileText size={20} /> },
    { name: '关于', path: '/about', icon: <User size={20} /> },
  ];
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  const handleLoginClick = () => {
    setShowLoginModal(true);
    setIsOpen(false);
  };

  const handleLogout = () => {
    setIsOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="font-title text-2xl text-terracotta-600 dark:text-terracotta-400">
                  沙漠一只雕
                </span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 
                    ${location.pathname === link.path 
                      ? 'text-terracotta-600 dark:text-terracotta-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-terracotta-500 dark:hover:text-terracotta-300'
                    }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              ))}
              
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              {user ? (
                <div className="flex items-center">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.username}</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="bg-terracotta-500 hover:bg-terracotta-600 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <LogIn size={18} className="mr-1" /> 登录
                </button>
              )}
            </div>
            
            <div className="flex md:hidden items-center">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 mr-2"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-white dark:bg-gray-900 shadow-lg"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-3 py-2 rounded-md text-base font-medium flex items-center
                      ${location.pathname === link.path 
                        ? 'text-terracotta-600 dark:text-terracotta-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-terracotta-500 dark:hover:text-terracotta-300'
                      }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="mr-2">{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>
                ))}
                
                {user ? (
                  <div className="flex items-center px-3 py-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.username}</span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleLoginClick}
                    className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white px-3 py-2 rounded-md text-base font-medium flex items-center justify-center"
                  >
                    <LogIn size={18} className="mr-1" /> 登录
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
};

export default Navbar;