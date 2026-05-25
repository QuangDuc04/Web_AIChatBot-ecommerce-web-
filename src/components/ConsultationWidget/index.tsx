"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Bot, X, Send, Loader2, Trash2 } from "lucide-react";
import {
  sendChatbotMessage,
  clearChatbotHistory,
  getChatbotHistory,
} from "@/lib/api/services/chatbotService";

function BotAvatar() {
  return (
    <div className="w-7 h-7 p-1 rounded-full overflow-hidden flex-shrink-0 bg-white border border-gray-200 flex items-center justify-center shadow-sm">
      <Image
        src="/assets/logos/logo.png"
        alt="Halo"
        width={28}
        height={28}
        className="object-cover"
      />
    </div>
  );
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const STORAGE_KEY = "natro_chatbot";
const URL_REGEX = /(https?:\/\/[^\s)]+)/g;
// Matches **bold text** but not empty ** ** and tolerates inner whitespace.
const BOLD_REGEX = /\*\*([^*\n]+?)\*\*/g;

/** Render inline markdown: **bold** within a text span. */
function renderBold(text: string, keyPrefix: string) {
  const out: React.ReactNode[] = [];
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  BOLD_REGEX.lastIndex = 0;
  while ((match = BOLD_REGEX.exec(text)) !== null) {
    if (match.index > lastIdx) {
      out.push(<span key={`${keyPrefix}-t-${lastIdx}`}>{text.slice(lastIdx, match.index)}</span>);
    }
    out.push(<strong key={`${keyPrefix}-b-${match.index}`}>{match[1]}</strong>);
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < text.length) {
    out.push(<span key={`${keyPrefix}-t-end`}>{text.slice(lastIdx)}</span>);
  }
  return out;
}

/** Render text with clickable links + **bold** markdown. Confirm URLs get a prominent button. */
function RichText({ text, isUser }: { text: string; isUser: boolean }) {
  const parts = text.split(URL_REGEX);
  return (
    <div className="whitespace-pre-wrap break-words">
      {parts.map((part, i) => {
        if (!URL_REGEX.test(part)) return <span key={i}>{renderBold(part, `p${i}`)}</span>;

        // Order confirmation link → render as button
        if (part.includes("/confirm/")) {
          return (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 mb-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1a7a74] hover:bg-[#18958e] text-white text-[14px] font-semibold rounded-xl transition-colors no-underline shadow-sm"
            >
              Xác nhận đặt hàng
            </a>
          );
        }

        // Regular URL → inline link
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className={`underline break-all ${isUser ? "text-white/90" : "text-blue-600 hover:text-blue-800"}`}
          >
            {part}
          </a>
        );
      })}
    </div>
  );
}

function getTimeString() {
  return new Date().toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function loadMessages(): Message[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveMessages(messages: Message[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

export default function ConsultationWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Load saved messages on mount, sync with Redis
  useEffect(() => {
    const localMsgs = loadMessages();
    setMessages(localMsgs);
    setIsLoaded(true);

    // Check if Redis session still alive
    if (localMsgs.length > 0) {
      getChatbotHistory()
        .then((res) => {
          if (!res.messages || res.messages.length === 0) {
            // Redis expired → clear localStorage
            setMessages([]);
            localStorage.removeItem(STORAGE_KEY);
          }
        })
        .catch(() => {});
    }
  }, []);

  // Listen for order confirmation from confirm page (other tab)
  useEffect(() => {
    try {
      const channel = new BroadcastChannel("natro_chatbot");
      channel.onmessage = (event) => {
        if (event.data?.type === "order_confirmed" && event.data.message) {
          const systemMsg: Message = {
            id: `sys-${Date.now()}`,
            role: "assistant",
            content: event.data.message,
            timestamp: new Date().toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          setMessages((prev) => {
            const updated = [...prev, systemMsg];
            saveMessages(updated);
            return updated;
          });
          setIsOpen(true);
        }
      };
      return () => channel.close();
    } catch {
      return undefined;
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = useCallback(
    async (overrideText?: string) => {
      const text = (overrideText ?? input).trim();
      if (!text || isLoading) return;

      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: getTimeString(),
      };

      // Functional update so a concurrent BroadcastChannel system message
      // (from another tab confirming an order) isn't overwritten.
      setMessages((prev) => {
        const next = [...prev, userMsg];
        saveMessages(next);
        return next;
      });
      setInput("");
      if (inputRef.current) inputRef.current.style.height = "20px";
      setIsLoading(true);

      const abort = new AbortController();
      abortRef.current = abort;

      const appendAssistant = (content: string, idPrefix: "b" | "e") => {
        const botMsg: Message = {
          id: `${idPrefix}-${Date.now()}`,
          role: "assistant",
          content,
          timestamp: getTimeString(),
        };
        setMessages((prev) => {
          const next = [...prev, botMsg];
          saveMessages(next);
          return next;
        });
      };

      try {
        const res = await sendChatbotMessage(text, abort.signal);
        if (abort.signal.aborted) return;
        appendAssistant(res.reply, "b");
      } catch {
        if (abort.signal.aborted) return;
        appendAssistant(
          "Xin lỗi, hệ thống đang tìm kiếm thông tin. Vui lòng thử lại sau hoặc liên hệ hotline 0347.366.345.",
          "e",
        );
      } finally {
        if (!abort.signal.aborted) setIsLoading(false);
        abortRef.current = null;
      }
    },
    [input, isLoading],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = async () => {
    // Abort any in-flight request
    abortRef.current?.abort();
    abortRef.current = null;
    setIsLoading(false);
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    try {
      await clearChatbotHistory();
    } catch {}
  };

  if (!isLoaded) return null;

  return (
    <>
      {/* Toggle button — bottom-left, above Music icon */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-[75px] right-[18px] z-[100] bg-blue-1 hover:bg-[#18958e] text-white w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
        aria-label={isOpen ? "Đóng tư vấn AI" : "Tư vấn AI"}
      >
        {isOpen ? <X size={22} /> : <Bot size={22} />}
      </button>

      {/* Chat panel */}
      <div
        className={`fixed bottom-[130px] right-[18px] z-[100] w-[370px] max-w-[calc(100vw-40px)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen
            ? "scale-100 opacity-100 pointer-events-auto"
            : "scale-0 opacity-0 pointer-events-none"
        }`}
        style={{ height: "500px" }}
      >
        {/* Header */}
        <div className="bg-blue-1 text-white px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
            <Bot size={18} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[15px]">Tư vấn AI</p>
            <p className="text-[13px] text-white/80 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Sẵn sàng hỗ trợ
            </p>
          </div>
          <button
            onClick={handleClear}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Xóa cuộc trò chuyện"
            title="Xóa cuộc trò chuyện"
          >
            <Trash2 size={16} />
          </button>
          <button onClick={() => setIsOpen(false)} aria-label="Đóng">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
          {messages.length === 0 && (
            <div className="text-center py-8 space-y-3">
              <div className="w-14 h-14 rounded-full bg-blue-1/10 flex items-center justify-center mx-auto">
                <Bot size={28} className="text-blue-1" />
              </div>
              <p className="text-[14px] font-[600] text-gray-700">
                Xin chào! Mình là trợ lý AI của Halo
              </p>
              <p className="text-[13px] text-gray-400 max-w-[260px] mx-auto">
                Hỏi mình về sản phẩm, giá cả, khuyến mãi, đặt hàng, hoặc tra cứu
                đơn hàng nhé!
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {[
                  "Có sản phẩm gì?",
                  "Khuyến mãi hôm nay",
                  "Tôi muốn đặt hàng",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    disabled={isLoading}
                    className="px-3 py-1.5 bg-white border border-blue-1/30 text-blue-1 rounded-full text-[13px] hover:bg-blue-1/5 transition-colors disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && <BotAvatar />}
                <div
                  className={`max-w-[75%] min-w-0 overflow-hidden px-3 py-2 rounded-2xl text-[14px] leading-relaxed ${
                    isUser
                      ? "bg-blue-1 text-white rounded-br-sm"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm"
                  }`}
                >
                  <RichText text={msg.content} isUser={isUser} />
                  <p
                    className={`text-[12px] mt-1 ${isUser ? "text-white/70" : "text-gray-400"}`}
                  >
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex items-start gap-2 justify-start">
              <BotAvatar />
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm shadow-sm px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 bg-blue-1/60 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-blue-1/60 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-blue-1/60 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-3 py-2.5 border-t border-gray-100 bg-gray-50/80">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white rounded-2xl border border-gray-200 focus-within:border-blue-1 focus-within:shadow-[0_0_0_3px_rgba(25,149,142,0.1)] transition-all px-3.5 py-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "20px";
                  e.target.style.height =
                    Math.min(e.target.scrollHeight, 80) + "px";
                }}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi..."
                disabled={isLoading}
                rows={1}
                className="w-full text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none disabled:opacity-50 resize-none max-h-[80px] overflow-y-auto leading-5 bg-transparent"
                style={{ height: "20px" }}
              />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="bg-blue-1 text-white w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center hover:bg-[#18958e] active:scale-95 transition-all disabled:opacity-40 shadow-sm"
              aria-label="Gửi"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
