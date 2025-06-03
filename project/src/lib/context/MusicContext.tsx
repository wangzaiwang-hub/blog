import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import type { Music } from '../../types';

interface MusicContextType {
  currentTrack: Music | null;
  playlist: Music[];
  isPlaying: boolean;
  loading: boolean;
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playlist, setPlaylist] = useState<Music[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Music | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log('[MusicContext] Provider rendered. isPlaying:', isPlaying, 'loading:', loading, 'currentTrack:', currentTrack?.title);

  // Effect for initializing audio element and event listeners
  useEffect(() => {
    console.log('[MusicContext] Audio initialization effect running.');
    if (!audioRef.current) {
      audioRef.current = new Audio();
      console.log('[MusicContext] New Audio element created.');
    }
    const audio = audioRef.current;

    const handlePlay = () => { console.log('[MusicContext] Audio event: play'); setIsPlaying(true); };
    const handlePause = () => { console.log('[MusicContext] Audio event: pause'); setIsPlaying(false); };
    const handleEnded = () => { 
      console.log('[MusicContext] Audio event: ended'); 
      setIsPlaying(false); 
      // Implement next track logic if desired, e.g., next();
    };
    const handleError = (e: Event) => {
      console.error('[MusicContext] Audio event: error', e);
      if (audio.error) {
        console.error('[MusicContext] MediaError code:', audio.error.code, 'message:', audio.error.message);
      }
      setIsPlaying(false);
      setLoading(false);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    console.log('[MusicContext] Event listeners added.');

    // Load initial music only if playlist is empty (e.g., on first mount)
    if (playlist.length === 0) {
      console.log('[MusicContext] Loading initial cloud music track.');
      setLoading(true);
      const cloudMusicTrack: Music = {
        id: 'cloud-bg-music',
        title: 'Background Music',
        artist: 'Cloud',
        url: '/markdown_files/resource/bg.mp3', // Ensure this file exists in your public folder
        cover_url: '',
      };
      setPlaylist([cloudMusicTrack]);
      setCurrentTrack(cloudMusicTrack); // This will trigger the other useEffect to set src
      // setLoading(false); // setLoading(false) should happen after src is set and potentially loaded
    }

    return () => {
      console.log('[MusicContext] Cleaning up audio initialization effect.');
      // audio.pause(); // Pause is handled by currentTrack effect or unmount of component
      // Do NOT set audio.src = '' here; src is managed by currentTrack effect
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      console.log('[MusicContext] Event listeners removed.');
    };
  }, []); // Runs once on mount, cleans up on unmount

  // Effect for handling changes to currentTrack (setting audio src)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentTrack && currentTrack.url) {
      console.log('[MusicContext] currentTrack changed. Setting audio source to:', currentTrack.url, 'Current src:', audio.src);
      if (audio.src !== currentTrack.url) { // Check if src actually needs changing
        audio.src = currentTrack.url;
        audio.load(); // Load the new source
        console.log('[MusicContext] Audio source set and load() called.');
      }
      // Autoplay is not implemented here; play must be called explicitly
      setLoading(false); // Set loading to false after attempting to set/load src
    } else {
      console.log('[MusicContext] No currentTrack or URL. Pausing and clearing src.');
      audio.pause();
      audio.src = '';
      setLoading(false);
    }
  }, [currentTrack]); // Runs when currentTrack changes

  const play = () => {
    console.log('[MusicContext] play() called. Current track:', currentTrack?.title);
    const audio = audioRef.current;

    if (!audio) {
      console.warn('[MusicContext] Cannot play: Audio element not initialized.');
      return;
    }
    if (!currentTrack || !currentTrack.url) {
      console.warn('[MusicContext] Cannot play: No current track or track URL.');
      return;
    }

    // Ensure src is set and attempt to load if it's different
    if (audio.src !== currentTrack.url) {
      console.log('[MusicContext] play(): src mismatch. Setting src to:', currentTrack.url, 'and calling load(). Current audio.src:', audio.src);
      audio.src = currentTrack.url;
      audio.load();
    }

    console.log('[MusicContext] Attempting to play:', audio.src);
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('[MusicContext] Playback started or resumed successfully.');
          // setIsPlaying(true) is handled by the 'play' event listener
        })
        .catch(error => {
          console.error('[MusicContext] Error attempting to play audio:', error);
          setIsPlaying(false); 
          if (error.name === 'NotAllowedError') {
            console.warn('[MusicContext] Autoplay prevented. User interaction may be required.');
          }
        });
    }
  };

  const pause = () => {
    console.log('[MusicContext] pause() called.');
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      audio.pause();
      // setIsPlaying(false) is handled by the 'pause' event listener
    } else {
      console.warn('[MusicContext] Cannot pause: Audio element not initialized or already paused.');
    }
  };

  const next = () => {
    if (playlist.length <= 1) {
      console.log('[MusicContext] Next: Playlist too short or empty.');
      return;
    }
    const nextIndex = (currentIndex + 1) % playlist.length;
    console.log('[MusicContext] Next: Playing track at index', nextIndex);
    setCurrentIndex(nextIndex);
    setCurrentTrack(playlist[nextIndex]);
    // Play will be triggered if it was playing, or user can press play
  };

  const previous = () => {
    if (playlist.length <= 1) {
      console.log('[MusicContext] Previous: Playlist too short or empty.');
      return;
    }
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    console.log('[MusicContext] Previous: Playing track at index', prevIndex);
    setCurrentIndex(prevIndex);
    setCurrentTrack(playlist[prevIndex]);
  };

  return (
    <MusicContext.Provider value={{
      currentTrack,
      playlist,
      isPlaying,
      loading,
      play,
      pause,
      next,
      previous
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};