import React, { useEffect, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { useMusic } from '../../lib/context/MusicContext';

const MusicAvatar: React.FC = () => {
  const { isPlaying, play, pause, loading, currentTrack } = useMusic();
  const [isAvatarVisible, setIsAvatarVisible] = useState(false);

  // 确保组件挂载后可见
  useEffect(() => {
    setIsAvatarVisible(true);
    console.log('[MusicAvatar] Component mounted, currentTrack:', currentTrack);
  }, [currentTrack]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('[MusicAvatar] handleToggle called! Current isPlaying state:', isPlaying);
    
    try {
      if (isPlaying) {
        console.log('[MusicAvatar] Calling pause()');
        pause();
      } else {
        console.log('[MusicAvatar] Calling play()');
        play();
      }
    } catch (error) {
      console.error('[MusicAvatar] Error in handleToggle:', error);
    }
  };

  if (!isAvatarVisible) {
    return null; // 等待组件完全挂载
  }

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
        style={{
          transition: 'transform 0.5s ease',
          transform: isPlaying ? 'rotate(360deg)' : 'rotate(0deg)',
          animation: isPlaying ? 'avatar-spin 3s linear infinite' : 'none',
        }}
        onClick={handleToggle}
        aria-label={isPlaying ? '暂停音乐' : '播放音乐'}
      >
        <img
          src="/me.webp"
          alt="头像"
          className="w-full h-full object-cover"
          draggable={false}
        />
        {/* 移除了播放按钮和灰色阴影 */}
      </button>
      <div className="mt-3 text-gray-500 text-sm">点击头像播放/暂停音乐</div>
      {/* 旋转动画的 keyframes */}
      <style>{`
        @keyframes avatar-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MusicAvatar;