import React from 'react';

interface CommentSectionProps {
  // Props can be added here if needed in the future
}

const CommentSection: React.FC<CommentSectionProps> = () => {
  // Comment functionality has been removed as Supabase is no longer used.
  // This component can be extended in the future with a static comment system.
  
  return (
    <div className="mt-10">
      <h3 className="text-2xl font-title text-gray-900 dark:text-white mb-6">
        评论
      </h3>
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        <p>评论功能已禁用。</p>
        <p className="mt-2">此博客目前为静态站点，不支持动态评论。</p>
      </div>
    </div>
  );
};

export default CommentSection;