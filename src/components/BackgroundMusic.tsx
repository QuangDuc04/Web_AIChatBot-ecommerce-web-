"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from "lucide-react";

// Royalty-free music — safe for commercial use
const playlist = [
  { title: "SoundHelix - Chill", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { title: "SoundHelix - Piano", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { title: "SoundHelix - Ambient", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { title: "SoundHelix - Groove", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  { title: "SoundHelix - Smooth", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
  { title: "SoundHelix - Beats", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
  { title: "SoundHelix - Rhythm", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
  { title: "SoundHelix - Vibe", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
];

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Init audio
  useEffect(() => {
    const audio = new Audio(playlist[0].src);
    audio.volume = 0.3;
    audio.loop = false;
    audioRef.current = audio;

    audio.addEventListener("timeupdate", () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    });

    audio.addEventListener("ended", () => {
      // Auto next track
      setCurrentTrack((prev) => {
        const next = (prev + 1) % playlist.length;
        audio.src = playlist[next].src;
        audio.play();
        return next;
      });
    });

    return () => {
      audio.pause();
      audio.remove();
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const changeTrack = useCallback((direction: "next" | "prev") => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTrack((prev) => {
      const next = direction === "next"
        ? (prev + 1) % playlist.length
        : (prev - 1 + playlist.length) % playlist.length;
      audio.src = playlist[next].src;
      if (isPlaying) audio.play().catch(() => {});
      setProgress(0);
      return next;
    });
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleVolume = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    if (v === 0) setIsMuted(true);
    else setIsMuted(false);
  }, []);

  return (
    <div className="fixed bottom-[18px] left-[18px] z-[100] hidden md:block">
      {/* Expanded player */}
      {expanded && (
        <div
          className="mb-3 bg-white rounded-2xl p-4 w-[260px] animate-[authSlideIn_0.2s_ease-out]"
          style={{ boxShadow: '0 8px 30px rgba(26,122,116,0.12), 0 0 0 1px rgba(26,122,116,0.06)' }}
        >
          {/* Track info */}
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-xl bg-[#edf9f8] flex items-center justify-center flex-shrink-0 ${isPlaying ? "animate-[spin_3s_linear_infinite]" : ""}`}>
              <Music size={18} className="text-[#1a7a74]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-[600] text-gray-800 truncate">{playlist[currentTrack].title}</p>
              <p className="text-[12px] text-gray-400">Track {currentTrack + 1} / {playlist.length}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-[#1a7a74] to-[#31c9c0] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <button
              onClick={() => changeTrack("prev")}
              aria-label="Bài trước"
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#1a7a74] hover:bg-[#edf9f8] transition-all duration-200"
            >
              <SkipBack size={16} />
            </button>
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Tạm dừng" : "Phát nhạc"}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a7a74] to-[#25998f] text-white flex items-center justify-center hover:shadow-[0_4px_15px_rgba(26,122,116,0.3)] transition-all duration-300"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>
            <button
              onClick={() => changeTrack("next")}
              aria-label="Bài tiếp"
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#1a7a74] hover:bg-[#edf9f8] transition-all duration-200"
            >
              <SkipForward size={16} />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <button onClick={toggleMute} aria-label={isMuted ? "Bật âm" : "Tắt âm"} className="text-gray-400 hover:text-[#1a7a74] transition-colors">
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolume}
              className="flex-1 h-1 accent-[#1a7a74] cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        aria-label={expanded ? "Đóng trình phát nhạc" : "Mở trình phát nhạc"}
        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
          isPlaying
            ? "bg-gradient-to-br from-[#1a7a74] to-[#25998f] text-white shadow-[0_4px_20px_rgba(26,122,116,0.3)]"
            : "bg-white text-gray-500 border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:text-[#1a7a74] hover:border-[#1a7a74]"
        }`}
      >
        <Music size={18} className={isPlaying ? "animate-pulse" : ""} />
      </button>
    </div>
  );
}
