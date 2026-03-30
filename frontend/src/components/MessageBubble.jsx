import React from 'react';

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const MessageBubble = ({ message, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-2 shadow-soft ${
          isOwn
            ? 'bg-blue-600 text-white'
            : 'bg-white border border-slate-200 text-slate-900'
        }`}
      >
        <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</div>
        <div className={`mt-1 text-[11px] ${isOwn ? 'text-blue-100' : 'text-slate-400'}`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
