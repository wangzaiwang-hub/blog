import React, { useState } from 'react';
import { useAuth } from '../../lib/context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Comment as CommentType } from '../../types';
import { Loader, Reply, Trash, Send } from 'lucide-react';

interface CommentProps {
  comment: CommentType;
  onDelete: (id: string) => void;
  onReply: (comment: CommentType) => void;
}

const Comment: React.FC<CommentProps> = ({ comment, onDelete, onReply }) => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formattedDate = new Date(comment.created_at).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleDelete = async () => {
    if (window.confirm('确认删除此评论？')) {
      setIsDeleting(true);
      try {
        const { error } = await supabase
          .from('comments')
          .delete()
          .eq('id', comment.id);
          
        if (error) throw new Error(error.message);
        
        onDelete(comment.id);
      } catch (err) {
        console.error('Error deleting comment:', err);
        alert('删除评论失败，请稍后再试');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('请先登录');
      return;
    }
    
    if (!replyContent.trim()) {
      alert('回复内容不能为空');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          content: replyContent,
          article_id: comment.article_id,
          user_id: user.id,
          parent_id: comment.id
        })
        .select('*, user:profiles(*)')
        .single();
        
      if (error) throw new Error(error.message);
      
      if (data) {
        onReply(data as CommentType);
        setReplyContent('');
        setShowReplyForm(false);
      }
    } catch (err) {
      console.error('Error submitting reply:', err);
      alert('提交回复失败，请稍后再试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 last:border-0">
      <div className="flex">
        <img 
          src={comment.user?.avatar_url || 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
          alt={comment.user?.username || 'User'} 
          className="w-10 h-10 rounded-full mr-3"
        />
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {comment.user?.username || 'Anonymous'}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formattedDate}
              </p>
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-gray-500 dark:text-gray-400 hover:text-terracotta-500 dark:hover:text-terracotta-400 flex items-center text-sm"
              >
                <Reply size={14} className="mr-1" /> 回复
              </button>
              
              {(user?.id === comment.user_id || user?.is_admin) && (
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 flex items-center text-sm"
                >
                  {isDeleting ? (
                    <Loader size={14} className="animate-spin mr-1" />
                  ) : (
                    <Trash size={14} className="mr-1" />
                  )}
                  删除
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-2 text-gray-700 dark:text-gray-300">
            {comment.content}
          </div>
          
          {showReplyForm && (
            <form onSubmit={handleSubmitReply} className="mt-3">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="写下你的回复..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-500 dark:bg-gray-700 dark:text-white"
                rows={3}
                required
              />
              <div className="flex justify-end mt-2 space-x-2">
                <button
                  type="button"
                  onClick={() => setShowReplyForm(false)}
                  className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3 py-1 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-md text-sm flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader size={12} className="animate-spin mr-1" />
                      提交中...
                    </>
                  ) : (
                    <>
                      <Send size={12} className="mr-1" />
                      提交回复
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
          
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
              {comment.replies.map((reply) => (
                <Comment 
                  key={reply.id} 
                  comment={reply} 
                  onDelete={onDelete} 
                  onReply={onReply} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;