import React from 'react';
import { motion } from 'framer-motion';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer
} from 'recharts';
import Layout from '../components/layout/Layout';
import { Mail, Github, Linkedin, Twitter } from 'lucide-react';

const skills = [
  { subject: 'JavaScript', A: 90, fullMark: 100 },
  { subject: 'React', A: 85, fullMark: 100 },
  { subject: 'TypeScript', A: 80, fullMark: 100 },
  { subject: 'Node.js', A: 75, fullMark: 100 },
  { subject: 'UI/UX', A: 70, fullMark: 100 },
  { subject: 'Database', A: 65, fullMark: 100 },
];

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-title text-gray-900 dark:text-white mb-4">
            关于我
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            在代码的世界里探索，在文字的海洋中徜徉
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-title text-gray-900 dark:text-white mb-4">
                我是谁
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="font-content">
                  你好，我是"沙漠一只雕"，一名热爱技术与创作的全栈开发者。
                </p>
                <p className="font-content">
                  我热衷于探索前端与后端技术的结合，致力于打造美观且功能强大的web应用。在工作之余，我喜欢记录学习心得，分享技术见解，也会写一些生活随笔。
                </p>
                <p className="font-content">
                  这个博客是我的个人空间，记录了我在技术领域的探索与成长，也包含了一些生活中的感悟与思考。希望我的文章能为你带来一些启发或帮助。
                </p>
                <p className="font-content">
                  如果你有任何问题或想法，欢迎随时联系我交流！
                </p>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                  联系方式
                </h3>
                <div className="flex space-x-4">
                  <a 
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=junqianxi.hub@gmail.com" 
                    className="text-gray-600 dark:text-gray-400 hover:text-terracotta-500 dark:hover:text-terracotta-400"
                    aria-label="Email"
                  >
                    <Mail size={24} />
                  </a>
                  <a 
                    href="https://github.com/wangzaiwang-hub" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-terracotta-500 dark:hover:text-terracotta-400"
                    aria-label="GitHub"
                  >
                    <Github size={24} />
                  </a>
                  <a 
                    href="https://x.com/JunQianxi" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-terracotta-500 dark:hover:text-terracotta-400"
                    aria-label="Twitter"
                  >
                    <Twitter size={24} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-title text-gray-900 dark:text-white mb-4">
                技能雷达
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skills}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fill: '#4b5563', fontSize: 12 }}
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 100]} 
                      tick={{ fill: '#4b5563', fontSize: 10 }}
                    />
                    <Radar 
                      name="技能" 
                      dataKey="A" 
                      stroke="#d15a46" 
                      fill="#d15a46" 
                      fillOpacity={0.6} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-title text-gray-900 dark:text-white mb-4">
              我的经历
            </h2>
            <div className="space-y-8">
              <div className="relative pl-8 border-l-2 border-terracotta-300 dark:border-terracotta-700">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-terracotta-500 rounded-full"></div>
                <div className="mb-1 text-terracotta-600 dark:text-terracotta-400 font-medium">
                  2025年至今
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  全栈开发工程师
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  构建出一些个人项目，项目构建，部署，后续维护均为一人完成，向着全栈开发迈进
                </p>
              </div>
              
              <div className="relative pl-8 border-l-2 border-terracotta-300 dark:border-terracotta-700">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-terracotta-500 rounded-full"></div>
                <div className="mb-1 text-terracotta-600 dark:text-terracotta-400 font-medium">
                  2024年 - 2025年
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  AI编程迅猛发展
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  使用Cursor和Windsurf等AI编程工具，开始对AI编程产生兴趣，并开始尝试使用AI编程工具进行项目设计。
                </p>
              </div>
              
              <div className="relative pl-8 border-l-2 border-terracotta-300 dark:border-terracotta-700">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-terracotta-500 rounded-full"></div>
                <div className="mb-1 text-terracotta-600 dark:text-terracotta-400 font-medium">
                  2024年
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  首次接触项目设计
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  完成了freecodecamp的响应式web设计课程，并拿到<a href="https://freecodecamp.org/certification/wangzaiwang/responsive-web-design" target="_blank" rel="noreferrer" className="text-terracotta-600 dark:text-terracotta-400 hover:text-terracotta-700 dark:hover:text-terracotta-300">Responsive Web Design</a>证书，开始对项目设计产生兴趣
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AboutPage;