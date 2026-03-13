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
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <defs>
                        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#60a5fa" />
                            <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                    </defs>
                    <path d="M21 15c0-4.63-3.08-8.52-7.27-9.7l.95-3.32-1.9-.56L11 7.21 9.22 1.42 7.32 1.98l.95 3.32C4.08 6.48 1 10.37 1 15v4h2v-4c0-4.42 3.58-8 8-8s8 3.58 8 8v4h2v-4z" fill="url(#logoGrad)" />
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

