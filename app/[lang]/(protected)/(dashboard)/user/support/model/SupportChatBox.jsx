'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Send, Bot, User, Paperclip, Image as ImageIcon,
  Smile, CheckCheck, Clock, Ticket, Wifi, WifiOff
} from 'lucide-react';

const botReplies = [
  "Thanks for reaching out! I'm reviewing your issue and will get back to you shortly.",
  "I understand your concern. Could you please provide your order ID for faster resolution?",
  "I've escalated this to our specialist team. You'll receive an update within 2–4 hours.",
  "Your issue has been noted. Is there anything else I can help you with?",
  "We apologize for the inconvenience. A full refund will be processed in 5–7 business days.",
  "Your ticket has been created successfully. You can track it in your support history.",
  "Thank you for your patience. Our team is working on your request right now.",
  "I've forwarded this to the relevant department. Please check your email for updates.",
];

const quickReplies = [
  'Where is my order?',
  'I want a refund',
  'Product is damaged',
  'Wrong item delivered',
  'Cancel my order',
  'Track my refund',
  'Exchange product',
];

const emojis = [
  '😊','😎','😍','🥰','😘','🤗','🤩','🤔','😔','😞','😤','😠','😭','😢','😭',
  '👍','👎','🙌','👏','✌️','🤞','🤟','🤘','👌','💯','✅','❌','❓','❕',
  '📦','💳','🚚','🛍️','👤','💬','🔥','⭐','❤️','💔','📱','⌚','🔋','🔌','🔊','🎧'
];

// Updated initialMessages with DD-MM-YYYY hh:mm A format
const initialMessages = [
  // Oldest first
  {
    id: 1,
    from: 'user',
    date: '28-02-2026 11:23 AM',
    time: '11:23 AM',
    read: false,
    text: "I received wrong product for my order.",
  },
  {
    id: 2,
    from: 'bot',
    date: '28-02-2026 11:25 AM',
    time: '11:25 AM',
    read: true,
    text: "Thank you for letting us know. I've created a replacement order and the pickup for the wrong item is scheduled for tomorrow.",
  },
  {
    id: 3,
    from: 'user',
    date: '01-03-2026 03:45 PM',
    time: '03:45 PM',
    read: false,
    text: "My order ORD-20250301 has not arrived yet. It was supposed to be delivered yesterday.",
  },
  {
    id: 4,
    from: 'bot',
    date: '01-03-2026 03:47 PM',
    time: '03:47 PM',
    read: true,
    text: "I apologize for the delay Vishal. Let me check the status for ORD-20250301. It's currently out for delivery and should arrive today.",
  },
  {
    id: 5,
    from: 'bot',
    date: '01-03-2026 10:01 AM',
    time: '10:01 AM',
    read: true,
    text: "Hello Vishal! 👋 Welcome to support. I'm your virtual assistant. How can I help you today?",
  },
  {
    id: 6,
    from: 'bot',
    date: '01-03-2026 10:01 AM',
    time: '10:01 AM',
    read: true,
    text: "You can ask me about your orders, refunds, delivery issues, or any product queries.",
  },
];

export default function SupportChatBox({ ticket, onClose }) {
  const [messages, setMessages]     = useState(initialMessages);
  const [input, setInput]           = useState('');
  const [isTyping, setIsTyping]     = useState(false);
  const [showEmoji, setShowEmoji]   = useState(false);
  const [isOnline, setIsOnline]     = useState(true);
  const [mediaEnabled, setMediaEnabled] = useState(true);
  const [isSending, setIsSending]   = useState(false);
  const [sendCooldown, setSendCooldown] = useState(0);
  const bottomRef                   = useRef(null);
  const inputRef                    = useRef(null);

  // Simulate online/offline status
  useEffect(() => {
    const interval = setInterval(() => {
      setIsOnline(Math.random() > 0.3);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Cooldown timer
  useEffect(() => {
    if (sendCooldown > 0) {
      const timer = setTimeout(() => setSendCooldown(p => p - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [sendCooldown]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = useCallback((text, imageFile = null) => {
    if (sendCooldown > 0 || isSending) return;
    const msg = text || '';
    if (!msg.trim() && !imageFile) return;

    setIsSending(true);
    setSendCooldown(3);

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB').split('/').reverse().join('-') + ' ' + 
                    now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    const userMsg = {
      id: Date.now(),
      from: 'user',
      date: dateStr,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      read: false,
      text: msg.trim(),
      image: imageFile ? URL.createObjectURL(imageFile) : null,
    };

    setInput('');
    setMessages(p => [...p, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const reply = botReplies[Math.floor(Math.random() * botReplies.length)];
      const replyDateStr = now.toLocaleDateString('en-GB').split('/').reverse().join('-') + ' ' + 
                          now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      
      setMessages(p => [...p, {
        id: Date.now() + 1,
        from: 'bot',
        date: replyDateStr,
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
        read: true,
        text: reply,
      }]);
      setIsSending(false);
    }, 2000 + Math.random() * 1500);

  }, [isSending, sendCooldown]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleImageUpload = (e) => {
    if (!mediaEnabled) return;
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      sendMessage('', file);
      e.target.value = '';
    }
  };

  const canSend = !isSending && sendCooldown === 0 && input.trim();

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-0 sm:pb-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 80 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        onClick={e => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl border border-gray-100 flex flex-col"
        style={{ height: '85vh', maxHeight: '680px' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-800 px-5 py-4 flex items-center gap-3 rounded-t-3xl sm:rounded-t-2xl flex-shrink-0 shadow-lg">
          <div className="relative">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 ${
              isOnline ? 'bg-emerald-400 border-emerald-800 shadow-md' : 'bg-gray-500 border-gray-700'
            }`}>
              {isOnline ? <Wifi className="w-2 h-2 text-emerald-900" /> : <WifiOff className="w-2 h-2 text-gray-700" />}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white/95">Support Assistant</p>
            <p className="text-xs text-emerald-100">
              {isOnline ? '● Online · Instant replies' : '● Offline · Will reply soon'}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {ticket && (
              <span className="text-xs font-mono text-emerald-200 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-lg">
                {ticket.id}
              </span>
            )}
            <button onClick={onClose}
              className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all shadow-sm"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gradient-to-b from-emerald-50/80 to-white"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}>
          <style jsx>{`
            ::-webkit-scrollbar { width: 4px; height: 4px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
            ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
          `}</style>

          {groupMessagesByDate(messages).map(({ displayDate, uniqueKey, msgs}) => (
            <React.Fragment key={uniqueKey}>
              <div className="flex items-center gap-3 my-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium px-3 whitespace-nowrap">{displayDate}</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <AnimatePresence initial={false}>
                {msgs.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 16, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className={`flex items-end gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ${
                      msg.from === 'bot'
                        ? 'bg-gradient-to-br from-emerald-600 to-teal-700'
                        : 'bg-gradient-to-br from-gray-700 to-gray-900'
                    }`}>
                      {msg.from === 'bot' ? <Bot className="w-3.5 h-3.5 text-white" /> : <User className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className={`max-w-[78%] ${msg.from === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        msg.from === 'user'
                          ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-br-none'
                          : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm'
                      }`}>
                        {msg.text}
                        {msg.image && (
                          <img src={msg.image} alt="Uploaded image" className="mt-2 w-full max-w-[200px] max-h-[200px] rounded-lg object-cover shadow-md" />
                        )}
                      </div>
                      <div className={`flex items-center gap-1 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
                        <span className="text-xs text-gray-400">{msg.time}</span>
                        {msg.from === 'user' && <CheckCheck className="w-3 h-3 text-emerald-400" />}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </React.Fragment>
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-sm">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-sm"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>

        {/* Quick replies */}
        <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide border-t border-gray-50 flex-shrink-0">
          {quickReplies.map(qr => (
            <motion.button
              key={qr} whileTap={{ scale: 0.95 }}
              onClick={() => sendMessage(qr)}
              className="flex-shrink-0 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-full transition-colors shadow-sm"
            >
              {qr}
            </motion.button>
          ))}
        </div>

        {/* Emoji picker */}
        <AnimatePresence>
          {showEmoji && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              className="px-4 py-2 flex gap-1.5 border-t border-gray-100 flex-shrink-0 overflow-x-auto scrollbar-hide bg-gray-50"
            >
              {emojis.map(e => (
                <motion.button
                  key={e} whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setInput(p => p + e);
                    setShowEmoji(false);
                    inputRef.current?.focus();
                  }}
                  className="text-xl flex-shrink-0"
                >
                  {e}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input bar */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-2 flex-shrink-0 bg-white rounded-b-3xl sm:rounded-b-2xl">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (!isSending && sendCooldown === 0) {
                document.getElementById('imageInput').click();
              }
            }}
            className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
          >
            <ImageIcon className={`w-4 h-4 ${mediaEnabled ? 'text-emerald-600' : 'text-gray-400'}`} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowEmoji(p => !p)}
            className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
          >
            <Smile className="w-4 h-4 text-gray-500" />
          </motion.button>

          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isSending || sendCooldown > 0}
            className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm outline-none text-gray-900 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          />

          <input
            id="imageInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={!mediaEnabled || isSending || sendCooldown > 0}
          />

          <motion.button
            whileHover={canSend ? { scale: 1.1 } : {}}
            whileTap={canSend ? { scale: 0.9 } : {}}
            onClick={() => sendMessage(input)}
            disabled={!canSend}
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md transition-all ${
              canSend
                ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white hover:shadow-emerald-500/25 shadow-emerald-500/25'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {sendCooldown > 0 ? (
              <span className="text-xs font-mono">{sendCooldown}s</span>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// 🔥 NEW: Handles DD-MM-YYYY hh:mm A format automatically

function groupMessagesByDate(messages) {
  // Parse DD-MM-YYYY hh:mm A → sortable date key + display date
  const groups = {};
  messages.forEach(msg => {
    const dateMatch = msg.date.match(/^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2})\s+(AM|PM)$/);
    if (dateMatch) {
      const [, day, month, year, hour, minute, ampm] = dateMatch;
      const hour12 = parseInt(hour);
      let hour24 = hour12;
      if (ampm === 'PM' && hour12 !== 12) hour24 += 12;
      if (ampm === 'AM' && hour12 === 12) hour24 = 0;
      
      // Sortable key: YYYY-MM-DD HH:mm
      const sortKey = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${hour24.toString().padStart(2, '0')}:${minute}`;
      
      // Display date: DD-MM-YYYY
      const displayDate = `${day}-${month}-${year}`;
      
      if (!groups[displayDate]) {
        groups[displayDate] = { msgs: [] };
      }
      groups[displayDate].msgs.push({ ...msg, sortKey });
    }
  });

  // Generate groups with UNIQUE keys
  const sortedGroups = Object.entries(groups)
    .map(([displayDate, { msgs }], index) => ({
      displayDate,
      // ✅ UNIQUE KEY: displayDate + index
      uniqueKey: `${displayDate}-${index}`,
      msgs: msgs.sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    }))
    .sort((a, b) => {
      const dateA = a.displayDate.split('-').reverse().join('-');
      const dateB = b.displayDate.split('-').reverse().join('-');
      return new Date(dateA) - new Date(dateB);
    });

  return sortedGroups;
}
