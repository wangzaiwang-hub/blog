import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

interface Tag {
  id: string;
  name: string;
  size: 'sm' | 'md' | 'lg';
  color: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  githubUrl?: string;
  tech: string[];
}

const tags: Tag[] = [
  { id: '1', name: 'React', size: 'lg', color: 'bg-blue-500 text-white' },
  { id: '2', name: '前端开发', size: 'md', color: 'bg-purple-500 text-white' },
  { id: '3', name: 'JavaScript', size: 'lg', color: 'bg-yellow-500 text-white' },
  { id: '4', name: 'TypeScript', size: 'md', color: 'bg-blue-600 text-white' },
  { id: '5', name: '技术博客', size: 'sm', color: 'bg-green-500 text-white' },
  { id: '6', name: 'Node.js', size: 'md', color: 'bg-green-600 text-white' },
  { id: '7', name: '后端开发', size: 'sm', color: 'bg-red-500 text-white' },
  { id: '8', name: 'Supabase', size: 'md', color: 'bg-emerald-500 text-white' },
  { id: '9', name: '摄影', size: 'sm', color: 'bg-pink-500 text-white' },
  { id: '10', name: '阅读', size: 'sm', color: 'bg-orange-500 text-white' },
  { id: '11', name: '旅行', size: 'md', color: 'bg-teal-500 text-white' },
  { id: '12', name: '音乐', size: 'sm', color: 'bg-indigo-500 text-white' },
];

const projects: Project[] = [
  {
    id: '1',
    name: 'WE Tools',
    description: 'WE Tools 精选全球免费高效工具，涵盖办公效率、设计创意、开发编程等领域，提供软件下载与网站导航服务，助力提升您的工作流与数字生活体验。',
    url: 'https://wetools.wctw.fun/',
    githubUrl: 'https://github.com/wangzaiwang-hub',
    tech: ['工具箱', '合集', '第一次']
  },
  {
    id: '2',
    name: '音量调到49',
    description: '根据reddit上的最烂音量设计大赛，我做了一个音量调到49的网站，一个恶搞不能放松的游戏',
    url: 'https://49game.wctw.fun/',
    githubUrl: 'https://github.com/wangzaiwang-hub/game',
    tech: ['恶搞', '游戏', 'React']
  },
  {
    id: '3',
    name: '个人简历',
    description: '用markdown做一份个人简历，样式主题可自选',
    githubUrl: 'https://github.com/wangzaiwang-hub/resume',
    tech: ['Markdown', 'Tailwind CSS', 'React']
  }
];

const sizeClass = {
  sm: 'text-sm px-2 py-1',
  md: 'text-base px-3 py-1.5',
  lg: 'text-lg px-4 py-2'
};

const TagCloud: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-title text-gray-900 dark:text-white mb-4">关于我</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <motion.span
              key={tag.id}
              className={`inline-block rounded-full font-medium ${sizeClass[tag.size]} ${tag.color}`}
              whileHover={{ y: -5, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 10 }}
            >
              {tag.name}
            </motion.span>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-title text-gray-900 dark:text-white mb-4">我的项目</h2>
        <div className="flex flex-col gap-4">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 10 }}
            >
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {project.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.tech.map((tech, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-sand-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm flex items-center text-terracotta-600 dark:text-terracotta-400 hover:text-terracotta-700 dark:hover:text-terracotta-300"
                  >
                    <ExternalLink size={14} className="mr-1" /> 访问
                  </a>
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      <Github size={14} className="mr-1" /> 源码
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagCloud;