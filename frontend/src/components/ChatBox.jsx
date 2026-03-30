import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../services/api';
import { useSocket } from '../context/SocketContext';
import MessageBubble from './MessageBubble';

const buildRoomId = (senderId, receiverId) => {
  if (!senderId || !receiverId) return '';
  return [senderId, receiverId].sort().join(':');
};

const createBeep = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 740;
    gainNode.gain.value = 0.06;
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.12);
  } catch (error) {
    // Audio is optional; ignore errors silently
  }
};

const ChatBox = ({ senderId, receiverId, token }) => {
  const { socket, status, joinRoom, leaveRoom } = useSocket();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const listRef = useRef(null);

  const roomId = useMemo(() => buildRoomId(senderId, receiverId), [senderId, receiverId]);

  useEffect(() => {
    if (!roomId) return;
    joinRoom(roomId);
    return () => leaveRoom(roomId);
  }, [roomId, joinRoom, leaveRoom]);

  useEffect(() => {
    let isMounted = true;

    const fetchHistory = async () => {
      if (!receiverId || !senderId) {
        setMessages([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/messages`, {
          params: { with: receiverId },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!isMounted) return;
        setMessages(response.data || []);
      } catch (error) {
        if (!isMounted) return;
        setMessages([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, [receiverId, senderId, token]);

  useEffect(() => {
    if (!socket || !receiverId || !senderId) return;

    const handleMessage = (payload) => {
      if (!payload) return;
      const matchesChat =
        (payload.senderId === senderId && payload.receiverId === receiverId) ||
        (payload.senderId === receiverId && payload.receiverId === senderId);

      if (!matchesChat) return;

      setMessages((prev) => [...prev, payload]);
      if (payload.senderId === receiverId) {
        createBeep();
      }
    };

    const handleTyping = (payload) => {
      if (!payload) return;
      if (payload.senderId !== receiverId || payload.receiverId !== senderId) return;
      setIsTyping(Boolean(payload.isTyping));
    };

    socket.on('chat:message', handleMessage);
    socket.on('chat:typing', handleTyping);

    return () => {
      socket.off('chat:message', handleMessage);
      socket.off('chat:typing', handleTyping);
    };
  }, [socket, receiverId, senderId]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || !socket || !senderId || !receiverId) return;

    const payload = {
      senderId,
      receiverId,
      message: trimmed,
      timestamp: new Date().toISOString(),
    };

    socket.emit('chat:message', payload);
    setMessages((prev) => [...prev, payload]);
    setInput('');
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInput(value);

    if (!socket || !senderId || !receiverId) return;
    socket.emit('chat:typing', { senderId, receiverId, isTyping: true });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('chat:typing', { senderId, receiverId, isTyping: false });
    }, 1200);
  };

  const connectionLabel = status === 'connected' ? 'Online' : status === 'reconnecting' ? 'Reconnecting' : 'Offline';
  const connectionColor = status === 'connected' ? 'bg-emerald-500' : status === 'reconnecting' ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Chat</p>
          <p className="text-xs text-slate-500">Receiver ID: {receiverId || 'Not selected'}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className={`h-2.5 w-2.5 rounded-full ${connectionColor}`} />
          {connectionLabel}
        </div>
      </div>

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {loading ? (
          <div className="text-center text-sm text-slate-400">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-sm text-slate-400">
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map((msg, index) => (
            <MessageBubble
              key={`${msg.timestamp || index}-${index}`}
              message={msg}
              isOwn={msg.senderId === senderId}
            />
          ))
        )}

        {isTyping && (
          <div className="text-xs text-slate-400">User is typing...</div>
        )}
      </div>

      <div className="border-t border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleSend();
            }}
            disabled={!receiverId}
          />
          <button
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            onClick={handleSend}
            disabled={!input.trim() || !receiverId}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
