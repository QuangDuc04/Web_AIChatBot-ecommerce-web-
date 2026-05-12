"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Loader2, User } from "lucide-react";
import { app } from "@/config/constants";
import { apiPost, apiGet } from "@/lib/api/client";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
const STORAGE_KEY = "packing_chat";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChatMessage {
  id: string;
  message: string;
  senderType: "guest" | "admin" | "system";
  senderName?: string;
  createdAt: string;
}

interface ChatState {
  conversationId: string;
  guestName: string;
  guestPhone: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getTimeString(date?: string) {
  return new Date(date ?? new Date()).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function loadChatState(): ChatState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveChatState(state: ChatState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ---------------------------------------------------------------------------
// Info form (before chat starts)
// ---------------------------------------------------------------------------

function InfoForm({ onStart, isLoading }: {
  onStart: (data: { name: string; phone: string; email?: string; message?: string }) => void;
  isLoading: boolean;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    onStart({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      message: message.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-3">
      <div className="text-center mb-2">
        <div className="w-12 h-12 rounded-full bg-blue-1/10 flex items-center justify-center mx-auto mb-2">
          <User size={24} className="text-blue-1" />
        </div>
        <p className="text-[14px] font-[600] text-gray-800">Thông tin liên hệ</p>
        <p className="text-[12px] text-gray-400">Vui lòng cho chúng tôi biết thông tin của bạn</p>
      </div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Họ và tên *"
        required
        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:border-blue-1 text-gray-800"
      />
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Số điện thoại *"
        required
        type="tel"
        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:border-blue-1 text-gray-800"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email (không bắt buộc)"
        type="email"
        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:border-blue-1 text-gray-800"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Nội dung cần tư vấn..."
        rows={2}
        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:border-blue-1 text-gray-800 resize-none"
      />
      <button
        type="submit"
        disabled={isLoading || !name.trim() || !phone.trim()}
        className="w-full py-2.5 bg-blue-1 text-white text-[14px] font-[600] rounded-xl hover:bg-[#18958e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        {isLoading ? "Đang kết nối..." : "Bắt đầu chat"}
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Chat window (after info submitted)
// ---------------------------------------------------------------------------

function ChatWindow({
  conversationId,
  guestName,
  messages,
  onSend,
  onClose,
}: {
  conversationId: string;
  guestName: string;
  messages: ChatMessage[];
  onSend: (text: string) => void;
  onClose: () => void;
}) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    onSend(text);
    setInput("");
  };

  return (
    <>
      {/* Header */}
      <div className="bg-blue-1 text-white px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
          <MessageCircle size={18} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-[15px]">{app.shopName}</p>
          <p className="text-[12px] text-white/80 flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full bg-green-400`} />
            Đang trực tuyến
          </p>
        </div>
        <button onClick={onClose} aria-label="Đóng">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
        {messages
          .filter((msg) => msg.senderType !== "system")
          .map((msg) => {
          const isGuest = msg.senderType === "guest";

          return (
            <div key={msg.id} className={`flex ${isGuest ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-3 py-2 rounded-2xl text-[14px] leading-relaxed ${
                  isGuest
                    ? "bg-blue-1 text-white rounded-br-sm"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm"
                }`}
              >
                {!isGuest && (
                  <p className="text-[11px] font-[600] text-blue-1 mb-0.5">{app.shopName}</p>
                )}
                <p className="whitespace-pre-wrap">{msg.message}</p>
                <p className={`text-[11px] mt-1 ${isGuest ? "text-white/70" : "text-gray-400"}`}>
                  {getTimeString(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-white">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Nhập câu hỏi..."
            rows={1}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-2xl text-[14px] focus:outline-none focus:border-blue-1 text-gray-800 resize-none max-h-[100px] overflow-y-auto leading-[1.4]"
            style={{ height: 'auto', minHeight: '38px' }}
            ref={(el) => {
              if (el) {
                el.style.height = '38px';
                el.style.height = Math.min(el.scrollHeight, 100) + 'px';
              }
            }}
          />
          <button
            type="submit"
            className="bg-blue-1 text-white w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center hover:bg-[#18958e] transition-colors"
            aria-label="Gửi tin nhắn"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main ChatBox
// ---------------------------------------------------------------------------

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatState, setChatState] = useState<ChatState | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStarting, setIsStarting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // Load saved chat state on mount
  useEffect(() => {
    const saved = loadChatState();
    if (saved) setChatState(saved);
    setIsLoaded(true);
  }, []);

  // Load messages when chat state exists and chatbox opens
  useEffect(() => {
    if (!chatState || !isOpen) return;

    apiGet<{ messages: any[] }>(`/chat/${chatState.conversationId}/messages`)
      .then((res) => {
        const msgs: ChatMessage[] = (res?.messages || []).map((m: any) => ({
          id: m.id,
          message: m.message,
          senderType: m.type === "system" ? "system" : m.senderUserId ? "admin" : "guest",
          senderName: m.senderUser ? `${m.senderUser.firstName || ""} ${m.senderUser.lastName || ""}`.trim() : undefined,
          createdAt: m.createdAt,
        }));
        setMessages(msgs);
      })
      .catch(() => {
        // Conversation might be deleted/expired — reset
        localStorage.removeItem(STORAGE_KEY);
        setChatState(null);
      });
  }, [chatState, isOpen]);

  // Connect socket when chat state exists
  useEffect(() => {
    if (!chatState) return;

    const socket = io(SOCKET_URL, {
      auth: { conversationId: chatState.conversationId },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 2000,
    });


    // Receive messages from admin (skip guest's own messages — already added optimistically)
    socket.on("message:new", (msg: any) => {
      const isOwnMessage = msg.senderType === "guest" || (!msg.senderUserId && !msg.senderUser);
      if (isOwnMessage) return;

      const chatMsg: ChatMessage = {
        id: msg.id || `msg-${Date.now()}`,
        message: msg.message,
        senderType: msg.senderUserId ? "admin" : "system",
        senderName: msg.senderName || (msg.senderUser ? `${msg.senderUser.firstName || ""} ${msg.senderUser.lastName || ""}`.trim() : undefined),
        createdAt: msg.createdAt || new Date().toISOString(),
      };
      setMessages((prev) => {
        if (prev.some((m) => m.id === chatMsg.id)) return prev;
        return [...prev, chatMsg];
      });
    });

    // Confirmation of sent message
    socket.on("message:sent", (msg: any) => {
      // Already added optimistically, but update with real ID
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [chatState]);

  // Start new conversation
  const handleStart = useCallback(async (data: { name: string; phone: string; email?: string; message?: string }) => {
    setIsStarting(true);
    try {
      const res = await apiPost<{ conversation: any; messages: any[] }>("/chat/start", data);
      const conv = res.conversation;
      const state: ChatState = {
        conversationId: conv.id,
        guestName: data.name,
        guestPhone: data.phone,
      };
      saveChatState(state);
      setChatState(state);

      // Map initial messages
      const msgs: ChatMessage[] = (res.messages || []).map((m: any) => ({
        id: m.id,
        message: m.message,
        senderType: m.type === "system" ? "system" : "guest",
        createdAt: m.createdAt,
      }));
      setMessages(msgs);
    } catch {
      // Error handled silently
    } finally {
      setIsStarting(false);
    }
  }, []);

  // Send message
  const handleSend = useCallback((text: string) => {
    if (!chatState) return;

    // Optimistic add
    const optimisticMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      message: text,
      senderType: "guest",
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    // Send via socket (realtime) + API (persistence)
    if (socketRef.current?.connected) {
      socketRef.current.emit("message:send", { message: text });
    } else {
      // Fallback to REST API
      apiPost(`/chat/${chatState.conversationId}/messages`, { message: text }).catch(() => {});
    }
  }, [chatState]);

  if (!isLoaded) return null;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-[75px] right-[18px] z-[100] bg-blue-1 hover:bg-[#18958e] text-white w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
        aria-label={isOpen ? "Đóng chat" : "Mở chat"}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
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
        {chatState ? (
          <ChatWindow
            conversationId={chatState.conversationId}
            guestName={chatState.guestName}
            messages={messages}
            onSend={handleSend}
            onClose={() => setIsOpen(false)}
          />
        ) : (
          <>
            {/* Header for info form */}
            <div className="bg-blue-1 text-white px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle size={18} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[15px]">{app.shopName}</p>
                <p className="text-[12px] text-white/80">Hỗ trợ trực tuyến</p>
              </div>
              <button onClick={() => setIsOpen(false)} aria-label="Đóng">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <InfoForm onStart={handleStart} isLoading={isStarting} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
