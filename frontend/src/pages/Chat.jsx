import React, { useEffect, useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Typography, Input, message, List, Spin } from 'antd';
import AuthContext from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../services/api';

const { Title } = Typography;

const Chat = () => {
    const { user } = useContext(AuthContext);
    const { socket, isConnected } = useSocket();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const addMessage = (msg) => {
        if (!msg || (!msg._id && !msg.id)) {
            setMessages((prev) => [...prev, msg]);
            return;
        }
        setMessages((prev) => {
            const exists = prev.some((m) => (m._id && msg._id && m._id === msg._id) || (m.id && msg.id && m.id === msg.id));
            if (exists) return prev;
            return [...prev, msg];
        });
    };

    useEffect(() => {
        const loadHistory = async () => {
            if (!user?.id && !user?._id) return;

            setLoadingHistory(true);
            const userId = user._id || user.id;

            try {
                const res = await api.get(`/messages/${userId}`);
                if (Array.isArray(res.data)) {
                    setMessages(res.data);
                }
            } catch (err) {
                console.error('Failed to load chat history', err);
                message.error('Could not load chat history.');
            } finally {
                setLoadingHistory(false);
            }
        };

        loadHistory();
    }, [user]);

    useEffect(() => {
        if (!socket) return;

        const onMessage = (payload) => {
            addMessage(payload);
        };

        socket.on('chat:message', onMessage);

        return () => {
            socket.off('chat:message', onMessage);
        };
    }, [socket]);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!['volunteer', 'ngo'].includes(user.role)) {
        message.error('Chat is available only to volunteers or NGOs.');
        return <Navigate to="/" replace />;
    }

    const sendMessage = () => {
        if (!input.trim()) return;
        if (!socket || !isConnected) {
            message.error('Socket is not connected yet.');
            return;
        }

        const msg = { text: input.trim(), from: user.name, time: new Date().toISOString() };
        socket.emit('chat:message', msg);
        setMessages((prev) => [...prev, msg]);
        setInput('');
    };

    return (
        <div style={{ padding: 24 }}>
            <Title level={2}>Chat</Title>
            <p>Role: {user.role}</p>
            <p>Socket: {isConnected ? 'Connected' : 'Connecting...'}</p>

            {loadingHistory ? (
                <div style={{ textAlign: 'center', padding: 32 }}>
                    <Spin size="large" />
                </div>
            ) : (
                <List
                    size="small"
                    bordered
                    dataSource={messages}
                    style={{ marginBottom: 16, maxHeight: 320, overflow: 'auto' }}
                    renderItem={(item, index) => (
                        <List.Item key={index}>
                            <b>{item.from}:</b> {item.text}
                        </List.Item>
                    )}
                />
            )}

            <Input.Search
                value={input}
                onChange={(e) => setInput(e.target.value)}
                enterButton="Send"
                onSearch={sendMessage}
                placeholder="Type a message and press Send"
                disabled={loadingHistory}
            />
        </div>
    );
};

export default Chat;
