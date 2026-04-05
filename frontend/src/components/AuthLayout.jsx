import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Avatar, Dropdown, Space, Typography, Badge, Tooltip, notification, Spin } from 'antd';
import {
    AppstoreOutlined,
    UserOutlined,
    LogoutOutlined,
    BellOutlined,
    BankOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    CheckCircleOutlined,
    InfoCircleOutlined,
    StarOutlined,
    MessageOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { API_URL } from '../services/api';
import './AuthLayout.css';

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

const AuthLayout = ({ children, pageTitle = 'Dashboard' }) => {
    const { user, token, logout } = useContext(AuthContext);
    const { socket } = useSocket();
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loadingNotifs, setLoadingNotifs] = useState(false);

    useEffect(() => {
        if (token) {
            fetchNotifications();
            // Poll for new notifications every 60 seconds
            const interval = setInterval(fetchNotifications, 60000);
            return () => clearInterval(interval);
        }
    }, [token]);

    useEffect(() => {
        if (socket) {
            socket.on('new_notification', fetchNotifications);
            return () => socket.off('new_notification', fetchNotifications);
        }
    }, [socket]);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`${API_URL}/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Map backend fields to what component expects
            const formatted = response.data.map(n => ({
                id: n._id,
                title: n.title,
                desc: n.message,
                time: new Date(n.createdAt).toLocaleDateString() + ' ' + new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                read: n.isRead,
                type: n.type,
            }));
            setNotifications(formatted);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    // Auto-mark messages as read when visiting chat
    useEffect(() => {
        if (location.pathname === '/chat') {
            const unreadMessages = notifications.filter(n => !n.read && n.type === 'message');
            if (unreadMessages.length > 0) {
                unreadMessages.forEach(msg => {
                    markSingleRead(msg.id);
                });
            }
        }
    }, [location.pathname, notifications]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const unreadCount = notifications.filter(n => !n.read).length;
    const unreadMessageCount = notifications.filter(n => !n.read && n.type === 'message').length;

    const renderMessageLabel = () => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span>Messages</span>
            {unreadMessageCount > 0 && !collapsed && (
                <Badge count={unreadMessageCount} size="small" style={{ backgroundColor: '#0f6fff', boxShadow: 'none' }} />
            )}
        </div>
    );

    // Nav items based on role
    const navItems = user?.role === 'ngo'
        ? [
            { key: '/manage-opportunities', icon: <AppstoreOutlined />, label: 'Manage Opportunities' },
            { key: '/ngo-profile', icon: <BankOutlined />, label: 'NGO Profile' },
            { 
                key: '/chat', 
                icon: (
                    <Badge count={collapsed ? unreadMessageCount : 0} size="small" dot offset={[2, 0]}>
                        <MessageOutlined />
                    </Badge>
                ), 
                label: renderMessageLabel(), 
                tooltipTitle: 'Messages' 
            },
        ]
        : [
            { key: '/matches', icon: <StarOutlined />, label: 'My Matches' },
            { key: '/opportunities', icon: <AppstoreOutlined />, label: 'Opportunities' },
            { key: '/profile', icon: <UserOutlined />, label: 'My Profile' },
            { 
                key: '/chat', 
                icon: (
                    <Badge count={collapsed ? unreadMessageCount : 0} size="small" dot offset={[2, 0]}>
                        <MessageOutlined />
                    </Badge>
                ), 
                label: renderMessageLabel(), 
                tooltipTitle: 'Messages' 
            },
        ];

    const markAllRead = async () => {
        try {
            await axios.put(`${API_URL}/notifications/read-all`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const markSingleRead = async (id) => {
        try {
            await axios.put(`${API_URL}/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(x => x.id === id ? { ...x, read: true } : x));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const clearAllNotifications = async () => {
        try {
            await axios.delete(`${API_URL}/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications([]);
        } catch (error) {
            console.error('Failed to clear notifications:', error);
        }
    };

    const notificationItems = [
        {
            key: 'header',
            label: (
                <div className="notif-header">
                    <span className="notif-title">Notifications</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {unreadCount > 0 && (
                            <button className="notif-mark-all" onClick={markAllRead}>
                                Mark read
                            </button>
                        )}
                        {notifications.length > 0 && (
                            <button className="notif-clear-all" onClick={clearAllNotifications}>
                                Clear all
                            </button>
                        )}
                    </div>
                </div>
            ),
            disabled: true,
        },
        ...notifications.map(n => ({
            key: String(n.id),
            label: (
                <div
                    className={`notif-item${n.read ? '' : ' notif-unread'}`}
                    onClick={() => {
                        if (!n.read) markSingleRead(n.id);
                    }}
                >
                    <div className="notif-dot-wrap">
                        {!n.read && <span className="notif-dot" />}
                        {n.read && <CheckCircleOutlined style={{ color: '#94a3b8', fontSize: 12 }} />}
                    </div>
                    <div className="notif-content">
                        <div className="notif-item-title">{n.title}</div>
                        <div className="notif-item-desc">{n.desc}</div>
                        <div className="notif-item-time">{n.time}</div>
                    </div>
                </div>
            ),
        })),
        {
            key: 'empty',
            label: notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '12px 0', color: '#94a3b8', fontSize: 13 }}>
                    <InfoCircleOutlined style={{ marginRight: 6 }} />No notifications
                </div>
            ) : null,
            disabled: true,
        },
    ].filter(item => item.label !== null);

    // User avatar dropdown
    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: user?.role === 'ngo'
                ? <Link to="/ngo-profile">NGO Profile</Link>
                : <Link to="/profile">My Profile</Link>,
        },
        ...(user?.role === 'ngo' ? [{
            key: 'manage',
            icon: <AppstoreOutlined />,
            label: <Link to="/manage-opportunities">Manage Opportunities</Link>,
        }] : []),
        { type: 'divider' },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Sign Out',
            danger: true,
            onClick: handleLogout,
        },
    ];

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    return (
        <Layout className="auth-shell">
            {/* ── Sidebar ── */}
            <Sider
                className="auth-sider"
                collapsible
                collapsed={collapsed}
                trigger={null}
                width={240}
                collapsedWidth={72}
            >
                {/* Logo */}
                <Link to="/" className="sider-logo">
                    <svg width="28" height="28" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                        <defs>
                            <linearGradient id="sbGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#0f6fff" />
                                <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                            <linearGradient id="sbGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                        </defs>
                        <rect x="25" y="45" width="18" height="50" rx="6" fill="url(#sbGrad1)" />
                        <rect x="77" y="35" width="18" height="60" rx="6" fill="url(#sbGrad2)" />
                        <path d="M 34 50 C 50 15, 70 15, 86 40" stroke="url(#sbGrad1)" stroke-width="14" stroke-linecap="round" fill="none" />
                        <circle cx="95" cy="22" r="8" fill="#f59e0b" />
                    </svg>
                    {!collapsed && <span className="sider-logo-text">SkillBridge</span>}
                </Link>

                {/* Role badge */}
                {!collapsed && (
                    <div className="sider-role-badge">
                        <span className={`role-chip role-${user?.role}`}>
                            {user?.role === 'ngo' ? '🏢 NGO Dashboard' : '🙋 Volunteer'}
                        </span>
                    </div>
                )}

                {/* Nav items */}
                <nav className="sider-nav">
                    {navItems.map(item => {
                        const isActive = location.pathname === item.key;
                        return (
                            <Tooltip key={item.key} title={collapsed ? (item.tooltipTitle || item.label) : ''} placement="right">
                                <Link
                                    to={item.key}
                                    className={`sider-nav-item${isActive ? ' active' : ''}`}
                                >
                                    <span className="sider-nav-icon">{item.icon}</span>
                                    {!collapsed && <span className="sider-nav-label" style={{ width: '100%', display: 'block' }}>{item.label}</span>}
                                </Link>
                            </Tooltip>
                        );
                    })}
                </nav>

                {/* Spacer */}
                <div style={{ flex: 1 }} />

                {/* Bottom: user info + logout */}
                <div className="sider-footer">
                    {!collapsed ? (
                        <>
                            <div className="sider-user-row">
                                <Avatar
                                    size={36}
                                    style={{
                                        background: 'linear-gradient(135deg, #0f6fff, #06b6d4)',
                                        fontWeight: 700,
                                        fontSize: '0.9rem',
                                        flexShrink: 0,
                                    }}
                                >
                                    {initials}
                                </Avatar>
                                <div className="sider-user-info">
                                    <Text className="sider-user-name" ellipsis>{user?.name}</Text>
                                    <Text className="sider-user-role">{user?.role === 'ngo' ? 'NGO Account' : 'Volunteer'}</Text>
                                </div>
                            </div>
                            <button className="sider-logout-btn" onClick={handleLogout}>
                                <LogoutOutlined />
                                <span>Sign Out</span>
                            </button>
                        </>
                    ) : (
                        <Tooltip title="Sign Out" placement="right">
                            <button className="sider-logout-icon-btn" onClick={handleLogout}>
                                <LogoutOutlined />
                            </button>
                        </Tooltip>
                    )}
                </div>
            </Sider>

            {/* ── Main ── */}
            <Layout className="auth-main">
                {/* Top Header */}
                <Header className="auth-header">
                    <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
                        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </button>

                    <div className="auth-header-title">
                        <span className="page-breadcrumb">SkillBridge /</span>
                        <span className="page-name">{pageTitle}</span>
                    </div>

                    <div className="auth-header-right">
                        {/* Notification bell */}
                        <Dropdown
                            menu={{ items: notificationItems }}
                            placement="bottomRight"
                            trigger={['click']}
                            overlayClassName="notif-dropdown"
                        >
                            <Badge count={unreadCount} size="small" offset={[-2, 2]}>
                                <button className="icon-btn">
                                    <BellOutlined />
                                </button>
                            </Badge>
                        </Dropdown>

                        <div className="header-divider" />

                        {/* User dropdown */}
                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                            <Space className="header-user-pill" style={{ cursor: 'pointer' }}>
                                <Avatar
                                    size={34}
                                    style={{
                                        background: 'linear-gradient(135deg, #0f6fff, #06b6d4)',
                                        fontWeight: 700,
                                        fontSize: '0.85rem',
                                        border: '2px solid rgba(15,111,255,0.25)',
                                        flexShrink: 0,
                                    }}
                                >
                                    {initials}
                                </Avatar>
                                <div className="header-user-text">
                                    <Text className="header-username">{user?.name}</Text>
                                    <Text className="header-userrole">{user?.role === 'ngo' ? 'NGO' : 'Volunteer'}</Text>
                                </div>
                            </Space>
                        </Dropdown>
                    </div>
                </Header>

                <Content className="auth-content">
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default AuthLayout;
