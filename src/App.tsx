/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Neon Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-center">
        
        {/* Left Side - Title / Info */}
        <div className="hidden lg:flex flex-col items-end text-right space-y-4 pr-8">
          <div className="w-64 h-32 bg-gradient-to-br from-cyan-400 to-fuchsia-500 rounded-xl shadow-[0_0_30px_rgba(0,255,255,0.3)]" />
          <p className="text-zinc-300 font-orbitron text-sm max-w-[250px] leading-relaxed tracking-wide drop-shadow-md">
            A retro-futuristic arcade experience. Eat the glowing orbs, avoid the walls, and don't bite your own tail.
          </p>
        </div>

        {/* Center - Game */}
        <div className="flex justify-center">
          <SnakeGame />
        </div>

        {/* Right Side - Music Player */}
        <div className="flex justify-center lg:justify-start pl-0 lg:pl-8">
          <MusicPlayer />
        </div>

      </div>
      
      {/* Mobile Title (shows only on small screens) */}
      <h1 className="lg:hidden mt-8 text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-fuchsia-500 drop-shadow-[0_0_10px_rgba(255,0,255,0.3)] text-center">
        NEON SNAKE
      </h1>
    </div>
  );
}
