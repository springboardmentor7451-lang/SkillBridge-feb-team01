import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Typography, Input, Button, message, List } from 'antd';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const { Title } = Typography;

const Chat = () => {
    const { user } = useContext(AuthContext);
    const { socket, isConnected } = useSocket();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!socket) return;

        const onMessage = (payload) => {
            setMessages((prev) => [...prev, payload]);
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

            <Input.Search
                value={input}
                onChange={(e) => setInput(e.target.value)}
                enterButton="Send"
                onSearch={sendMessage}
                placeholder="Type a message and press Send"
            />
        </div>
    );
};

export default Chat;
