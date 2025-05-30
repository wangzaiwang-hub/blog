import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Comment as CommentType } from '../../types';
import Comment from './Comment';
import { Loader, Send } from 'lucide-react';

interface CommentSectionProps {
  articleId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ articleId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      
      try {
        // First get top-level comments
        const { data: topLevelComments, error } = await supabase
          .from('comments')
          .select(`
            *,
            user:profiles(*)
          `)
          .eq('article_id', articleId)
          .is('parent_id', null)
          .order('created_at', { ascending: false });
          
        if (error) throw new Error(error.message);
        
        // Then get replies for each comment
        if (topLevelComments) {
          const commentsWithReplies = await Promise.all(
            topLevelComments.map(async (comment) => {
              const { data: replies } = await supabase
                .from('comments')
                .select(`
                  *,
                  user:profiles(*)
                `)
                .eq('parent_id', comment.id)
                .order('created_at', { ascending: true });
                
              return {
                ...comment,
                replies: replies || []
              };
            })
          );
          
          setComments(commentsWithReplies as CommentType[]);
        }
      } catch (err) {
        console.error('Error fetching comments:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchComments();
  }, [articleId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    
    if (!commentContent.trim()) {
      alert('评论内容不能为空');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          content: commentContent,
          article_id: articleId,
          user_id: user.id
        })
        .select('*, user:profiles(*)')
        .single();
        
      if (error) throw new Error(error.message);
      
      if (data) {
        // Update comment count in article
        await supabase
          .from('articles')
          .update({ comment_count: comments.length + 1 })
          .eq('id', articleId);
          
        setComments([{ ...data, replies: [] } as CommentType, ...comments]);
        setCommentContent('');
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
      alert('提交评论失败，请稍后再试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = (id: string) => {
    setComments(prevComments => {
      // Check if it's a top-level comment
      const topLevelIndex = prevComments.findIndex(c => c.id === id);
      
      if (topLevelIndex !== -1) {
        // It's a top-level comment, remove it
        return prevComments.filter(c => c.id !== id);
      } else {
        // It's a reply, find the parent and remove the reply
        return prevComments.map(comment => {
          if (comment.replies?.some(reply => reply.id === id)) {
            return {
              ...comment,
              replies: comment.replies.filter(reply => reply.id !== id)
            };
          }
          return comment;
        });
      }
    });
  };

  const handleAddReply = (reply: CommentType) => {
    setComments(prevComments => {
      return prevComments.map(comment => {
        if (comment.id === reply.parent_id) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply]
          };
        }
        return comment;
      });
    });
  };

  return (
    <div className="mt-10">
      <h3 className="text-2xl font-title text-gray-900 dark:text-white mb-6">
        评论 ({comments.length})
      </h3>
      
      <form onSubmit={handleSubmitComment} className="mb-8">
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="写下你的评论..."
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-500 dark:bg-gray-700 dark:text-white"
          rows={4}
          required
          onClick={() => {
            if (!user) {
              setShowLoginPrompt(true);
            }
          }}
        />
        
        {showLoginPrompt && !user && (
          <div className="mt-2 text-terracotta-600 dark:text-terracotta-400 text-sm">
            请先登录后再发表评论
          </div>
        )}
        
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={isSubmitting || !user}
            className={`px-4 py-2 rounded-md text-white flex items-center ${
              user 
                ? 'bg-terracotta-500 hover:bg-terracotta-600' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader size={16} className="animate-spin mr-2" />
                提交中...
              </>
            ) : (
              <>
                <Send size={16} className="mr-2" />
                发表评论
              </>
            )}
          </button>
        </div>
      </form>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader size={30} className="animate-spin text-terracotta-500" />
        </div>
      ) : comments.length > 0 ? (
        <div>
          {comments.map((comment) => (
            <Comment 
              key={comment.id} 
              comment={comment} 
              onDelete={handleDeleteComment}
              onReply={handleAddReply}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          <p>暂无评论</p>
          <p className="mt-2">快来发表第一条评论吧！</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;