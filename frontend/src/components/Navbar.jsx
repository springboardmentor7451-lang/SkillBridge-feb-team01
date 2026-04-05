import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Space, Avatar, Dropdown, Typography } from 'antd';
import {
    UserOutlined,
    LogoutOutlined,
    AppstoreOutlined,
    InfoCircleOutlined,
    BankOutlined,
    SettingOutlined,
    LoginOutlined,
    RocketOutlined,
} from '@ant-design/icons';
import AuthContext from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import './Navbar.css';

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {
    const { user, logout, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Nav items for all users
    const navItems = [
        { key: '/opportunities', label: <Link to="/opportunities">Opportunities</Link>, icon: <AppstoreOutlined /> },
        { key: '/organizations', label: <Link to="/organizations">For NGOs</Link>, icon: <BankOutlined /> },
        { key: '/matches', label: <Link to="/matches">Matches</Link>, icon: <AppstoreOutlined /> },
        { key: '/chat', label: <Link to="/chat">Chat</Link>, icon: <UserOutlined /> },
        { key: '/notifications', label: <Link to="/notifications">Notifications</Link>, icon: <InfoCircleOutlined /> },
        { key: '/about', label: <Link to="/about">About Us</Link>, icon: <InfoCircleOutlined /> },
    ];

    // Dropdown menu for logged-in user avatar
    const userDropdownItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: user?.role === 'ngo' ? <Link to="/ngo-profile">NGO Profile</Link> : <Link to="/profile">My Profile</Link>,
        },
        ...(user?.role === 'ngo' ? [{
            key: 'manage',
            icon: <SettingOutlined />,
            label: <Link to="/manage-opportunities">Manage Opportunities</Link>,
        }] : []),
        { type: 'divider' },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            danger: true,
            onClick: handleLogout,
        },
    ];

    return (
        <Header className="app-navbar">
            {/* Logo */}
            <Link to="/" className="navbar-logo">
                <svg width="28" height="28" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="navLogoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#0f6fff" />
                            <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                        <linearGradient id="navLogoGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                    </defs>
                    <rect x="25" y="45" width="18" height="50" rx="6" fill="url(#navLogoGrad1)" />
                    <rect x="77" y="35" width="18" height="60" rx="6" fill="url(#navLogoGrad2)" />
                    <path d="M 34 50 C 50 15, 70 15, 86 40" stroke="url(#navLogoGrad1)" stroke-width="14" stroke-linecap="round" fill="none" />
                    <circle cx="95" cy="22" r="8" fill="#f59e0b" />
                </svg>
                <span className="navbar-logo-text">SkillBridge</span>
            </Link>

            {/* Center nav links */}
            <Menu
                mode="horizontal"
                selectedKeys={[location.pathname]}
                items={navItems}
                className="navbar-menu"
                disabledOverflow
            />

            {/* Right side — hidden during loading to prevent flicker */}
            <div className="navbar-right">
                {loading ? null : user ? (
                    <Space size={12}>
                        <NotificationBell />
                        <Dropdown menu={{ items: userDropdownItems }} placement="bottomRight" arrow>
                            <Space className="navbar-user" style={{ cursor: 'pointer' }}>
                                <Avatar
                                    size={36}
                                    style={{
                                        background: 'linear-gradient(135deg, #0f6fff, #06b6d4)',
                                        fontSize: '0.95rem',
                                        fontWeight: 700,
                                        border: '2px solid rgba(255,255,255,0.2)',
                                        flexShrink: 0,
                                    }}
                                >
                                    {user.name?.charAt(0).toUpperCase()}
                                </Avatar>
                                <Text className="navbar-username" ellipsis>
                                    {user.name}
                                </Text>
                            </Space>
                        </Dropdown>
                    </Space>
                ) : (
                    <Space size={8}>
                        <Link to="/login">
                            <Button
                                type="text"
                                className="navbar-login-btn"
                                icon={<LoginOutlined />}
                            >
                                Log In
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button
                                type="primary"
                                className="navbar-cta-btn"
                                icon={<RocketOutlined />}
                            >
                                Get Started
                            </Button>
                        </Link>
                    </Space>
                )}
            </div>
        </Header>
    );
};

export default Navbar;

