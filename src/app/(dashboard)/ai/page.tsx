"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm the **omixsystems AI Assistant**. I can help you with school-related tasks like generating reports, answering questions about education, analyzing student data, and assisting with administrative work. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();

    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to get AI response");
      }

      const data = await res.json();

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply || "I'm not sure how to respond to that.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function clearChat() {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm the **omixsystems AI Assistant**. I can help you with school-related tasks. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
    setError("");
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-omix-400" />
            AI Assistant
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Powered by omixsystems intelligent assistant
          </p>
        </div>
        <button
          onClick={clearChat}
          className="flex items-center gap-2 px-4 py-2 bg-surface-2 border border-border rounded-xl text-sm text-gray-400 hover:text-gray-200 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 glass rounded-2xl border-border overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={cn(
                  "flex gap-3",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {/* Assistant Avatar */}
                {msg.role === "assistant" && (
                  <div className="w-9 h-9 rounded-xl bg-omix-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-5 h-5 text-omix-400" />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={cn(
                    "max-w-[75%] px-5 py-3 rounded-2xl text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-omix-600/40 text-gray-100 rounded-tr-md"
                      : "glass text-gray-200 rounded-tl-md border border-border"
                  )}
                >
                  <div className="prose prose-invert prose-sm max-w-none">
                    {msg.content.split("\n").map((line, i) => (
                      <p key={i} className={i > 0 ? "mt-2" : ""}>
                        {line}
                      </p>
                    ))}
                  </div>
                  <p
                    className={cn(
                      "text-[10px] mt-2",
                      msg.role === "user"
                        ? "text-gray-500 text-right"
                        : "text-gray-600"
                    )}
                  >
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* User Avatar */}
                {msg.role === "user" && (
                  <div className="w-9 h-9 rounded-xl bg-surface-3 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-omix-500/10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-omix-400" />
              </div>
              <div className="glass rounded-2xl rounded-tl-md px-5 py-4 border border-border">
                <div className="flex items-center gap-1.5">
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-omix-400"
                  />
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: 0.2,
                    }}
                    className="w-2 h-2 rounded-full bg-omix-400"
                  />
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: 0.4,
                    }}
                    className="w-2 h-2 rounded-full bg-omix-400"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
            >
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400">{error}</span>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                disabled={loading}
                className="w-full px-5 py-3 bg-surface-2 border border-border rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none input-glow transition-all disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-11 h-11 rounded-xl bg-gradient-to-r from-omix-600 to-omix-500 hover:from-omix-500 hover:to-omix-400 flex items-center justify-center transition-all duration-300 glow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Send className="w-5 h-5 text-white" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
