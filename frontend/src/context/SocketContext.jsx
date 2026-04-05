import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);
const SOCKET_URL = 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const activeRoomRef = useRef(null);
  const [status, setStatus] = useState('connecting');

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        transports: ['websocket'],
        autoConnect: true,
        reconnection: true,
      });
    }

    const socket = socketRef.current;

    const handleConnect = () => {
      setStatus('connected');
      if (activeRoomRef.current) {
        socket.emit('chat:join', { roomId: activeRoomRef.current });
      }
    };

    const handleDisconnect = () => {
      setStatus('disconnected');
    };

    const handleReconnectAttempt = () => {
      setStatus('reconnecting');
    };

    const handleReconnect = () => {
      setStatus('connected');
      if (activeRoomRef.current) {
        socket.emit('chat:join', { roomId: activeRoomRef.current });
      }
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.io.on('reconnect_attempt', handleReconnectAttempt);
    socket.io.on('reconnect', handleReconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.io.off('reconnect_attempt', handleReconnectAttempt);
      socket.io.off('reconnect', handleReconnect);
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const joinRoom = (roomId) => {
    if (!roomId) return;
    activeRoomRef.current = roomId;
    if (socketRef.current?.connected) {
      socketRef.current.emit('chat:join', { roomId });
    }
  };

  const leaveRoom = (roomId) => {
    if (!roomId) return;
    if (socketRef.current?.connected) {
      socketRef.current.emit('chat:leave', { roomId });
    }
    if (activeRoomRef.current === roomId) {
      activeRoomRef.current = null;
    }
  };

  const value = useMemo(() => ({
    socket: socketRef.current,
    status,
    joinRoom,
    leaveRoom,
  }), [status]);

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
