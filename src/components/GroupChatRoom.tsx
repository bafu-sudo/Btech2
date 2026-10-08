import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Users,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Award,
  CheckCircle2,
  Clock,
  Music,
  ShieldCheck,
  Smile
} from 'lucide-react';
import { analyticsService } from '../services/analyticsService';

export interface ChatMessage {
  id: string;
  userName: string;
  role?: string;
  instrument: string;
  avatar: string;
  message: string;
  timestamp: string;
  isFounder?: boolean;
}

export const GroupChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeUsers, setActiveUsers] = useState<number>(1);
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('btech2_chat_username') || 'Brass Learner';
  });
  const [instrument, setInstrument] = useState<string>(() => {
    return localStorage.getItem('btech2_chat_instrument') || 'Bb Cornet';
  });
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/chat/messages', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
        if (data && typeof data.activeUsers === 'number') {
          setActiveUsers(data.activeUsers);
        }
      }
    } catch {
      // Offline fallback
    }
  };

  useEffect(() => {
    fetchMessages();

    // Send heartbeat specifically for the group chat room
    analyticsService.sendHeartbeat('group-chat', userName);

    // Poll every 3 seconds for real-time live chat updates & real-time online count
    const interval = setInterval(() => {
      fetchMessages();
      analyticsService.sendHeartbeat('group-chat', userName);
    }, 3000);

    return () => clearInterval(interval);
  }, [userName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const trimmedMsg = inputMessage.trim();
    setIsSending(true);

    // Save profile preferences
    try {
      localStorage.setItem('btech2_chat_username', userName);
      localStorage.setItem('btech2_chat_instrument', instrument);
    } catch {}

    const instrumentAvatars: Record<string, string> = {
      'Bb Cornet': '🎺',
      'Eb Soprano Cornet': '🎺',
      'Eb Tenor Horn': '🎷',
      'Bb Baritone': '🎷',
      'Bb Euphonium': '🎺',
      'Tenor Trombone': '🎵',
      'Bass Trombone': '🎵',
      'EEb Bass / Tuba': '🎺',
      'BBb Bass': '🎺',
      'Percussion': '🥁',
      'Bandmaster': '🧭'
    };

    const isFounderUser = userName.toLowerCase().includes('nokuvimba');

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: userName.trim(),
          role: isFounderUser ? 'Founder & Bandmaster' : 'Student Musician',
          instrument,
          avatar: instrumentAvatars[instrument] || '🎺',
          message: trimmedMsg,
          isFounder: isFounderUser
        })
      });

      if (res.ok) {
        setInputMessage('');
        await fetchMessages();
      }
    } catch {
      // If network offline, optimistic local message
      const localMsg: ChatMessage = {
        id: 'local_' + Date.now(),
        userName: userName.trim(),
        role: isFounderUser ? 'Founder' : 'Student Musician',
        instrument,
        avatar: instrumentAvatars[instrument] || '🎺',
        message: trimmedMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFounder: isFounderUser
      };
      setMessages((prev) => [...prev, localMsg]);
      setInputMessage('');
    } finally {
      setIsSending(false);
    }
  };

  const addQuickReaction = (emoji: string) => {
    setInputMessage((prev) => (prev ? `${prev} ${emoji}` : emoji));
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden flex flex-col h-[700px] max-w-5xl mx-auto">
      
      {/* CHAT HEADER WITH REAL-TIME ONLINE USERS */}
      <div className="border-b border-slate-800 bg-slate-950 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-100">
                Live Band Room Group Chat
              </h2>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{activeUsers} {activeUsers === 1 ? 'user' : 'users'} online right now</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Real-time peer chat for Salvation Army bands, school students & conductors
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={async () => {
            setIsRefreshing(true);
            await fetchMessages();
            setTimeout(() => setIsRefreshing(false), 500);
          }}
          className="self-start sm:self-center flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          title="Refresh chat messages"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Sync Chat</span>
        </button>
      </div>

      {/* USER PROFILE CUSTOMIZATION STRIP */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 px-6 py-2.5 flex flex-wrap items-center gap-3 text-xs">
        <span className="text-slate-400 font-medium">Your Chat Identity:</span>
        
        <div className="flex items-center gap-1.5">
          <label className="text-[11px] text-slate-500">Name:</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Your Name"
            className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-200 focus:border-amber-400 focus:outline-none w-32 sm:w-40"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <label className="text-[11px] text-slate-500">Instrument:</label>
          <select
            value={instrument}
            onChange={(e) => setInstrument(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
          >
            <option value="Bb Cornet">🎺 Bb Cornet</option>
            <option value="Eb Soprano Cornet">🎺 Eb Soprano Cornet</option>
            <option value="Eb Tenor Horn">🎷 Eb Tenor Horn</option>
            <option value="Bb Baritone">🎷 Bb Baritone</option>
            <option value="Bb Euphonium">🎺 Bb Euphonium</option>
            <option value="Tenor Trombone">🎵 Tenor Trombone</option>
            <option value="Bass Trombone">🎵 Bass Trombone</option>
            <option value="EEb Bass / Tuba">🎺 EEb Bass / Tuba</option>
            <option value="BBb Bass">🎺 BBb Bass</option>
            <option value="Percussion">🥁 Percussion</option>
            <option value="Bandmaster">🧭 Bandmaster</option>
          </select>
        </div>
      </div>

      {/* MESSAGES LIST STREAM */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No messages yet. Be the first to say hello in the Band Room!
          </div>
        ) : (
          messages.map((msg) => {
            const isFounder = Boolean(msg.isFounder);
            const isMe = msg.userName === userName;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-2xl ${
                  isMe ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                {/* AVATAR */}
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base ${
                    isFounder
                      ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                      : isMe
                      ? 'bg-blue-500/20 border border-blue-500/30'
                      : 'bg-slate-800 border border-slate-700'
                  }`}
                >
                  {msg.avatar || '🎺'}
                </div>

                {/* BUBBLE */}
                <div
                  className={`rounded-2xl p-3.5 text-xs sm:text-sm space-y-1 shadow-md ${
                    isFounder
                      ? 'border border-amber-500/40 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 text-slate-100'
                      : isMe
                      ? 'border border-blue-500/30 bg-blue-950/40 text-slate-100'
                      : 'border border-slate-800 bg-slate-950/80 text-slate-200'
                  }`}
                >
                  {/* SENDER INFO */}
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="font-bold text-slate-100">
                      {msg.userName}
                    </span>

                    {isFounder && (
                      <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[9px] font-bold text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                        <Sparkles className="h-2.5 w-2.5 text-amber-400" />
                        Founder
                      </span>
                    )}

                    <span className="text-[10px] text-slate-400">
                      ({msg.instrument})
                    </span>

                    <span className="text-[10px] text-slate-500 ml-auto font-mono">
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* MESSAGE TEXT */}
                  <p className="leading-relaxed whitespace-pre-wrap break-words">
                    {msg.message}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* QUICK REACTIONS STRIP */}
      <div className="border-t border-slate-800/80 bg-slate-950/40 px-4 py-2 flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="text-[11px] text-slate-500 flex items-center gap-1 shrink-0">
          <Smile className="h-3 w-3" />
          <span>Quick:</span>
        </span>
        {['🎺', '🎷', '🥁', '🎵', '🎼', '👏', '🔥', '⭐', 'God bless our band!'].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => addQuickReaction(item)}
            className="rounded-lg border border-slate-800 bg-slate-900/90 px-2 py-1 text-xs text-slate-300 hover:border-amber-500/40 hover:text-amber-300 transition-colors shrink-0"
          >
            {item}
          </button>
        ))}
      </div>

      {/* INPUT FORM */}
      <form onSubmit={handleSendMessage} className="border-t border-slate-800 bg-slate-950 p-4 flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={`Type a message as ${userName}...`}
          className="flex-1 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none"
        />

        <button
          type="submit"
          disabled={!inputMessage.trim() || isSending}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-amber-500 px-5 py-2.5 font-bold text-slate-950 shadow-md transition hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 shrink-0 text-xs sm:text-sm"
        >
          <Send className="h-4 w-4" />
          <span>Send</span>
        </button>
      </form>

    </div>
  );
};
