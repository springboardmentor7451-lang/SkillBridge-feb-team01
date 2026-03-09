import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Avatar, Dropdown, Space, Typography, Badge, Tooltip, notification } from 'antd';
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
} from '@ant-design/icons';
import AuthContext from '../context/AuthContext';
import './AuthLayout.css';

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

// Sample notifications data
const sampleNotifications = [
    { id: 1, title: 'New Applicant', desc: 'Alice Smith applied to "English Teacher" opportunity.', time: '2 min ago', read: false },
    { id: 2, title: 'Opportunity Closed', desc: 'Website Redesign is now closed to applications.', time: '1 hr ago', read: false },
    { id: 3, title: 'System Update', desc: 'New features have been added to your dashboard.', time: 'Yesterday', read: true },
];

const AuthLayout = ({ children, pageTitle = 'Dashboard' }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem('app_notifications');
        try {
            return saved ? JSON.parse(saved) : sampleNotifications;
        } catch (e) {
            return sampleNotifications;
        }
    });

    useEffect(() => {
        localStorage.setItem('app_notifications', JSON.stringify(notifications));
    }, [notifications]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearAllNotifications = () => {
        setNotifications([]);
    };

    // Nav items based on role
    const navItems = user?.role === 'ngo'
        ? [
            { key: '/manage-opportunities', icon: <AppstoreOutlined />, label: 'Manage Opportunities' },
            { key: '/ngo-profile', icon: <BankOutlined />, label: 'NGO Profile' },
        ]
        : [
            { key: '/opportunities', icon: <AppstoreOutlined />, label: 'Opportunities' },
            { key: '/profile', icon: <UserOutlined />, label: 'My Profile' },
        ];

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
                    onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
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
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                        <defs>
                            <linearGradient id="sbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#60a5fa" />
                                <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                        </defs>
                        <path d="M21 15c0-4.63-3.08-8.52-7.27-9.7l.95-3.32-1.9-.56L11 7.21 9.22 1.42 7.32 1.98l.95 3.32C4.08 6.48 1 10.37 1 15v4h2v-4c0-4.42 3.58-8 8-8s8 3.58 8 8v4h2v-4z" fill="url(#sbGrad)" />
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
                            <Tooltip key={item.key} title={collapsed ? item.label : ''} placement="right">
                                <Link
                                    to={item.key}
                                    className={`sider-nav-item${isActive ? ' active' : ''}`}
                                >
                                    <span className="sider-nav-icon">{item.icon}</span>
                                    {!collapsed && <span className="sider-nav-label">{item.label}</span>}
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
