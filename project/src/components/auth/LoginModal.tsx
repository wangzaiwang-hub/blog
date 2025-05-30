import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader } from 'lucide-react';
import { z } from 'zod';
import { useAuth } from '../../lib/context/AuthContext';

interface LoginModalProps {
  onClose: () => void;
}

const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少需要6个字符'),
});

const signupSchema = loginSchema.extend({
  username: z.string().min(2, '用户名至少需要2个字符'),
  confirmPassword: z.string().min(6, '确认密码至少需要6个字符'),
}).refine(data => data.password === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"],
});

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setConfirmPassword('');
    setErrors({});
    setMessage('');
    setMessageType('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setMessage('');
    setMessageType('');

    try {
      if (isLogin) {
        // Login validation
        loginSchema.parse({ email, password });
        
        const { error } = await signIn(email, password);
        if (error) throw new Error(error.message);
        
        setMessageType('success');
        setMessage('登录成功');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        // Signup validation
        signupSchema.parse({ email, password, username, confirmPassword });
        
        const { error } = await signUp(email, password, username);
        if (error) throw new Error(error.message);
        
        setMessageType('success');
        setMessage('注册成功，请登录');
        setTimeout(() => {
          setIsLogin(true);
          setPassword('');
          setConfirmPassword('');
        }, 1500);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(formattedErrors);
      } else if (error instanceof Error) {
        setMessageType('error');
        setMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div 
          className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            aria-label="Close"
          >
            <X size={24} />
          </button>
          
          <div className="p-6">
            <h2 className="text-2xl font-title text-gray-900 dark:text-white mb-6 text-center">
              {isLogin ? '登录' : '注册'}
            </h2>
            
            {messageType && (
              <div className={`mb-4 p-3 rounded ${
                messageType === 'success' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-400' 
                  : 'bg-red-100 text-red-700 dark:bg-red-800/30 dark:text-red-400'
              }`}>
                {message}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb-4">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    用户名
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.username ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="输入您的用户名"
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username}</p>
                  )}
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  电子邮箱
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="输入您的邮箱地址"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  密码
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.password ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="输入您的密码"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                )}
              </div>
              
              {!isLogin && (
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    确认密码
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.confirmPassword ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="再次输入密码"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                  )}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-terracotta-500 mt-2 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin mr-2" />
                    处理中...
                  </>
                ) : (
                  isLogin ? '登录' : '注册'
                )}
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <button
                onClick={toggleMode}
                className="text-terracotta-600 dark:text-terracotta-400 hover:underline text-sm font-medium"
              >
                {isLogin ? '没有账号？点击注册' : '已有账号？点击登录'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LoginModal;