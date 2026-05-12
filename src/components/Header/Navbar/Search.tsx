"use client";

import { Search, Mic, MicOff } from "lucide-react";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/product";
import { searchProducts } from "@/lib/api/services/productService";
import SearchResults from "./SearchResults";

// Web Speech API types
interface SpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchResultOpen, setIsSearchResultOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hasVoiceSupport, setHasVoiceSupport] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const router = useRouter();

  // Check voice support
  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    setHasVoiceSupport(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchProducts(searchTerm.trim(), { limit: 5 });
        setSearchResults(data?.items ?? []);
        setIsSearchResultOpen(true);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const navigateToSearch = useCallback(() => {
    const q = searchTerm.trim();
    if (!q) return;
    onCloseSearchResults();
    router.push(`/tim-kiem?q=${encodeURIComponent(q)}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, router]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") navigateToSearch();
  }

  function onCloseSearchResults() {
    setIsSearchResultOpen(false);
    setSearchTerm("");
    setSearchResults([]);
  }

  // Voice search
  const startListening = useCallback(() => {
    const w = window as unknown as Record<string, unknown>;
    const SpeechRecognition = (w.SpeechRecognition || w.webkitSpeechRecognition) as (new () => SpeechRecognitionInstance) | undefined;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "vi-VN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = e.results[0][0].transcript;
      setSearchTerm(transcript);
      setIsListening(false);
      // Auto navigate after voice result
      setTimeout(() => {
        if (transcript.trim()) {
          router.push(`/tim-kiem?q=${encodeURIComponent(transcript.trim())}`);
        }
      }, 500);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [router]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return (
    <div className="relative">
      <div className="rounded-full xl:w-[450px] w-[350px] h-[43px] flex items-center bg-[rgba(255,255,255,.2)]">
        <input
          type="text"
          placeholder={isListening ? "Đang nghe..." : "Tìm kiếm sản phẩm..."}
          className={`px-4 py-2 text-[15px] w-full focus:outline-none rounded-full bg-transparent text-white placeholder-white/70 ${isListening ? "animate-pulse" : ""}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* Voice button */}
        {hasVoiceSupport && (
          <button
            onClick={isListening ? stopListening : startListening}
            className={`flex-shrink-0 w-[35px] h-[35px] rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening
                ? "bg-red-500 text-white animate-pulse"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
            title={isListening ? "Dừng nghe" : "Tìm bằng giọng nói"}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
        )}

        {/* Search button */}
        <button
          onClick={navigateToSearch}
          aria-label="Tìm kiếm"
          className="button-gradient ml-1 p-2 text-white rounded-full h-[43px] min-w-[43px] flex items-center justify-center flex-shrink-0"
        >
          {isSearching ? (
            <span className="w-[18px] h-[18px] border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search size={18} />
          )}
        </button>
      </div>

      {/* Listening indicator */}
      {isListening && (
        <div className="absolute top-[50px] left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 z-50" style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-3 bg-red-500 rounded-full animate-[voice-bar_0.6s_ease-in-out_infinite]" />
            <span className="w-1.5 h-5 bg-red-400 rounded-full animate-[voice-bar_0.6s_ease-in-out_infinite_0.15s]" />
            <span className="w-1.5 h-4 bg-red-500 rounded-full animate-[voice-bar_0.6s_ease-in-out_infinite_0.3s]" />
            <span className="w-1.5 h-6 bg-red-400 rounded-full animate-[voice-bar_0.6s_ease-in-out_infinite_0.1s]" />
            <span className="w-1.5 h-3 bg-red-500 rounded-full animate-[voice-bar_0.6s_ease-in-out_infinite_0.25s]" />
          </div>
          <span className="text-[13px] font-[500] text-gray-600">Đang nghe...</span>
        </div>
      )}

      {isSearchResultOpen && !isListening && (
        <SearchResults
          searchResults={searchResults}
          onCloseSearchResults={onCloseSearchResults}
          searchTerm={searchTerm}
        />
      )}
    </div>
  );
};

export default SearchComponent;
