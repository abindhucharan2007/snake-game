import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'Neon Nights (AI Gen)',
    artist: 'CyberSynth',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 2,
    title: 'Digital Horizon (AI Gen)',
    artist: 'Null Pointer',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 3,
    title: 'Retrograde Protocol (AI Gen)',
    artist: 'System Override',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Autoplay might be blocked
        setIsPlaying(false);
      });
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    playNext();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-zinc-900/80 border border-fuchsia-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(255,0,255,0.1)] backdrop-blur-md">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />

      {/* Track Info */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-fuchsia-600 to-cyan-600 flex items-center justify-center shadow-[0_0_15px_rgba(255,0,255,0.4)] relative overflow-hidden">
          <Music className="w-8 h-8 text-white drop-shadow-md" />
          {isPlaying && (
            <div className="absolute inset-0 bg-white/20 animate-pulse mix-blend-overlay" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-fuchsia-400 font-bold text-lg truncate drop-shadow-[0_0_5px_rgba(255,0,255,0.5)]">
            {currentTrack.title}
          </h3>
          <p className="text-zinc-400 text-sm font-mono truncate">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div 
          className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden cursor-pointer relative group"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 relative transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_10px_#fff] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 text-zinc-400 hover:text-cyan-400 transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={playPrev}
            className="p-3 text-zinc-300 hover:text-fuchsia-400 hover:drop-shadow-[0_0_8px_rgba(255,0,255,0.8)] transition-all"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-fuchsia-500 text-white shadow-[0_0_15px_rgba(255,0,255,0.5)] hover:scale-105 hover:bg-fuchsia-400 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1" />
            )}
          </button>

          <button 
            onClick={playNext}
            className="p-3 text-zinc-300 hover:text-fuchsia-400 hover:drop-shadow-[0_0_8px_rgba(255,0,255,0.8)] transition-all"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>

        <div className="w-9" /> {/* Spacer for centering */}
      </div>
    </div>
  );
}
