import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import ChatBox from '../components/ChatBox';

const ChatPage = () => {
  const { user, token } = useContext(AuthContext);
  const [receiverId, setReceiverId] = useState('');

  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-50 px-6 py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-soft">
          <h1 className="text-xl font-semibold text-slate-900">Real-time Chat</h1>
          <p className="mt-1 text-sm text-slate-500">
            Start a conversation by entering a receiver ID and send messages instantly.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Receiver ID"
              value={receiverId}
              onChange={(event) => setReceiverId(event.target.value)}
            />
            <div className="text-xs text-slate-400">
              Your ID: <span className="font-semibold text-slate-700">{user?.id || user?._id || 'Unknown'}</span>
            </div>
          </div>
        </div>

        <div className="h-[560px]">
          <ChatBox
            senderId={user?.id || user?._id}
            receiverId={receiverId}
            token={token}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
