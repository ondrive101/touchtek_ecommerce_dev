'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Send, User, Smile, CheckCheck,
  HeadphonesIcon, MessageCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { sendMessage } from '@/action/common';
import { ticketStatus } from '../components/data';

const emojis = [
  '😊', '😎', '😍', '🥰', '😘', '🤗', '🤩', '🤔', '👍', '👎',
  '🙌', '👏', '✌️', '👌', '💯', '✅', '❌', '📦', '💳', '🚚',
  '🛍️', '👤', '💬', '🔥', '⭐', '❤️', '📱', '⌚', '🔋', '🎧'
];

const mapConversationToMessage = (conv, index) => {
  const isUser = conv?.senderRole === 'customer';
  const dateObj = conv?.createdAt ? new Date(conv.createdAt) : new Date();

  return {
    id: conv?.messageId || conv?._id || `msg-${index}-${Date.now()}`,
    from: isUser ? 'user' : 'support',
    senderName: isUser ? (conv?.senderName || 'You') : 'Support',
    text: conv?.message || '',
    attachments: conv?.attachments || [],
    createdAt: dateObj,
    time: !isNaN(dateObj.getTime())
      ? dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      : '',
    date: !isNaN(dateObj.getTime())
      ? dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : 'Today',
  };
};

function groupMessagesByDate(messages = []) {
  const groups = {};

  messages.forEach((msg, idx) => {
    let displayDate = 'Today';
    let sortKey = '';

    if (msg.createdAt) {
      const d = new Date(msg.createdAt);
      if (!isNaN(d.getTime())) {
        displayDate = d.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
        sortKey = d.toISOString();
      }
    } else if (msg.date) {
      displayDate = msg.date;
      sortKey = msg.date;
    }

    if (!groups[displayDate]) {
      groups[displayDate] = { displayDate, msgs: [] };
    }
    groups[displayDate].msgs.push({ ...msg, sortKey: sortKey || `${idx}` });
  });

  return Object.values(groups).map((g, index) => ({
    displayDate: g.displayDate,
    uniqueKey: `${g.displayDate}-${index}`,
    msgs: g.msgs,
  }));
}

export default function SupportChatBox({ ticket, onClose }) {
  const [messages, setMessages] = useState(() => {
    return Array.isArray(ticket?.conversations)
      ? ticket.conversations.map(mapConversationToMessage)
      : [];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (Array.isArray(ticket?.conversations)) {
      setMessages(ticket.conversations.map(mapConversationToMessage));
    } else {
      setMessages([]);
    }
  }, [ticket?.conversations]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async () => {
    const text = input.trim();
    if (!text) {
      toast.error("Please enter a message");
      return;
    }

    try {
      setLoading(true);

      const ticketIdentifier = ticket?.ticketId || ticket?._id;
      const payload = {
        ticketId: ticketIdentifier,
        message: text,
      };

      const response = await sendMessage(payload);

      const resData = response?.data;
      if (response?.success && resData?.success !== false) {
        // toast.success(resData?.message || response?.message || "Message sent successfully");
        const rawConv = resData?.conversation || response?.conversation;
        if (rawConv) {
          const newMsg = mapConversationToMessage(rawConv, messages.length);
          setMessages((prev) => [...prev, newMsg]);
        }
        setInput('');
      } else {
        toast.error(resData?.message || response?.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading && input.trim()) {
        handleSubmit();
      }
    }
  };

  const ticketIdentifier = ticket?.ticketId || ticket?._id || 'Ticket';
  const st = ticketStatus[ticket?.status] || ticketStatus.created;
  const canSend = Boolean(input.trim()) && !loading;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-0 sm:pb-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 80 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
        style={{ height: '85vh', maxHeight: '680px' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black px-5 py-4 flex items-center gap-3 rounded-t-3xl sm:rounded-t-2xl flex-shrink-0 shadow-md">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
            <HeadphonesIcon className="w-5 h-5 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">
              {ticket?.subject || 'Support Chat'}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-300 mt-0.5">
              <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-[11px] text-gray-200">
                {ticketIdentifier}
              </span>
              {ticket?.category && (
                <span className="capitalize text-gray-400 text-xs">
                  {ticket.category}
                </span>
              )}
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${st.bg} ${st.color} ${st.border}`}>
                <span className={`w-1 h-1 rounded-full ${st.dot}`} />
                {st.label}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors text-white flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Container */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gradient-to-b from-gray-50/70 to-white flex flex-col"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}
        >
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-500 my-auto">
              <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-3 text-indigo-600">
                <MessageCircle className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-gray-800">No Messages Yet</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">
                Send a message below to start the conversation for this ticket.
              </p>
            </div>
          ) : (
            groupMessagesByDate(messages).map(({ displayDate, uniqueKey, msgs }) => (
              <React.Fragment key={uniqueKey}>
                <div className="flex items-center gap-3 my-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-[11px] text-gray-400 font-medium px-3 whitespace-nowrap">
                    {displayDate}
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <AnimatePresence initial={false}>
                  {msgs.map((msg) => {
                    const isUser = msg.from === 'user';
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ${isUser
                            ? 'bg-gradient-to-br from-indigo-600 to-indigo-800'
                            : 'bg-gradient-to-br from-gray-700 to-gray-900'
                            }`}
                        >
                          {isUser ? (
                            <User className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <HeadphonesIcon className="w-3.5 h-3.5 text-white" />
                          )}
                        </div>

                        <div className={`max-w-[78%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
                          {!isUser && (
                            <span className="text-[10px] text-gray-500 font-semibold px-1">
                              Support
                            </span>
                          )}
                          <div
                            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${isUser
                              ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-br-none'
                              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                              }`}
                          >
                            {msg.text}
                          </div>
                          <div className={`flex items-center gap-1 ${isUser ? 'flex-row-reverse' : ''}`}>
                            <span className="text-[10px] text-gray-400">{msg.time}</span>
                            {isUser && <CheckCheck className="w-3 h-3 text-indigo-400" />}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </React.Fragment>
            ))
          )}

          <div ref={bottomRef} />
        </div>

        {/* Emoji picker */}
        <AnimatePresence>
          {showEmoji && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="px-4 py-2 flex gap-1.5 border-t border-gray-100 flex-shrink-0 overflow-x-auto scrollbar-hide bg-gray-50"
            >
              {emojis.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => {
                    setInput((p) => p + e);
                    setShowEmoji(false);
                    inputRef.current?.focus();
                  }}
                  className="text-xl hover:scale-125 transition-transform flex-shrink-0"
                >
                  {e}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Bar */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-2 flex-shrink-0 bg-white rounded-b-3xl sm:rounded-b-2xl">
          <button
            type="button"
            disabled={loading}
            onClick={() => setShowEmoji((p) => !p)}
            className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-50"
          >
            <Smile className="w-4 h-4 text-gray-500" />
          </button>

          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder={loading ? "Sending..." : "Type your message..."}
            className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm outline-none text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm disabled:opacity-60"
          />

          <motion.button
            whileHover={canSend ? { scale: 1.05 } : {}}
            whileTap={canSend ? { scale: 0.95 } : {}}
            onClick={handleSubmit}
            disabled={!canSend}
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md transition-all ${canSend
              ? 'bg-gradient-to-r from-indigo-500 to-indigo-700 text-white shadow-indigo-200'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
