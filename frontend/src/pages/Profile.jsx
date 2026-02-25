import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
    Card, Avatar, Typography, Tag, Divider,
    Descriptions, Row, Col, Space, Spin, Empty, Badge,
} from 'antd';
import {
    UserOutlined, MailOutlined, EnvironmentOutlined,
    FileTextOutlined, BankOutlined, GlobalOutlined,
    ToolOutlined, IdcardOutlined, CalendarOutlined,
} from '@ant-design/icons';
import AuthContext from '../context/AuthContext';
import './Profile.css';

const { Title, Paragraph, Text } = Typography;

const Profile = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!user) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
                <Empty description={<span>Please <Link to="/login">log in</Link> to view your profile.</span>} />
            </div>
        );
    }

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const isVolunteer = user.role === 'volunteer';

    return (
        <div className="profile-page">
            {/* Profile Header Card */}
            <Card className="profile-header-card">
                <div className="profile-hero-bg" />
                <div className="profile-header-body">
                    <div className="profile-avatar-wrap">
                        <Avatar
                            size={88}
                            style={{
                                background: isVolunteer
                                    ? 'linear-gradient(135deg, #0f6fff, #06b6d4)'
                                    : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                fontSize: '2rem',
                                fontWeight: 700,
                                border: '4px solid white',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            }}
                        >
                            {getInitials(user.name)}
                        </Avatar>
                    </div>
                    <div className="profile-identity">
                        <Title level={3} style={{ margin: 0, color: '#0f172a' }}>{user.name}</Title>
                        <Space style={{ marginTop: 6 }}>
                            <Tag
                                color={isVolunteer ? 'blue' : 'purple'}
                                icon={isVolunteer ? <UserOutlined /> : <BankOutlined />}
                                style={{ fontSize: '0.82rem', padding: '3px 12px', borderRadius: 99 }}
                            >
                                {isVolunteer ? 'Volunteer' : 'NGO Account'}
                            </Tag>
                            {user.location && (
                                <Tag icon={<EnvironmentOutlined />} color="default" style={{ borderRadius: 99 }}>
                                    {user.location}
                                </Tag>
                            )}
                        </Space>
                        {user.bio && (
                            <Paragraph type="secondary" style={{ marginTop: 12, marginBottom: 0, maxWidth: 560 }}>
                                {user.bio}
                            </Paragraph>
                        )}
                    </div>
                </div>
            </Card>

            {/* Info Section */}
            <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
                {/* Left: Contact */}
                <Col xs={24} md={14}>
                    <Card
                        title={
                            <Space>
                                <IdcardOutlined style={{ color: '#0f6fff' }} />
                                <span>Contact Information</span>
                            </Space>
                        }
                        className="profile-info-card"
                    >
                        <Descriptions column={1} colon={false} size="default">
                            <Descriptions.Item label={<Space><MailOutlined /> Email</Space>}>
                                <Text strong>{user.email}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label={<Space><EnvironmentOutlined /> Location</Space>}>
                                <Text>{user.location || <Text type="secondary">Not specified</Text>}</Text>
                            </Descriptions.Item>
                        </Descriptions>
                        <Divider style={{ margin: '16px 0' }} />
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Text strong style={{ color: '#475569' }}>
                                <FileTextOutlined style={{ marginRight: 6, color: '#0f6fff' }} />
                                Bio
                            </Text>
                            <Paragraph
                                type={user.bio ? undefined : 'secondary'}
                                style={{ marginBottom: 0, lineHeight: 1.8 }}
                            >
                                {user.bio || 'No bio provided yet.'}
                            </Paragraph>
                        </Space>
                    </Card>
                </Col>

                {/* Right: Skills or NGO Details */}
                <Col xs={24} md={10}>
                    {isVolunteer ? (
                        <Card
                            title={
                                <Space>
                                    <ToolOutlined style={{ color: '#0f6fff' }} />
                                    <span>Skills & Expertise</span>
                                </Space>
                            }
                            className="profile-info-card"
                        >
                            {user.skills && user.skills.length > 0 ? (
                                <div>
                                    {user.skills.map((skill, i) => (
                                        <Tag
                                            key={i}
                                            style={{
                                                marginBottom: 8,
                                                marginRight: 8,
                                                fontSize: '0.85rem',
                                                padding: '4px 14px',
                                                borderRadius: 99,
                                                background: 'rgba(15, 111, 255, 0.08)',
                                                border: '1px solid rgba(15, 111, 255, 0.2)',
                                                color: '#0f6fff',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {skill}
                                        </Tag>
                                    ))}
                                </div>
                            ) : (
                                <Empty description="No skills added yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            )}
                        </Card>
                    ) : (
                        <Card
                            title={
                                <Space>
                                    <BankOutlined style={{ color: '#6366f1' }} />
                                    <span>Organization Details</span>
                                </Space>
                            }
                            className="profile-info-card"
                        >
                            <Descriptions column={1} colon={false}>
                                <Descriptions.Item label={<Space><BankOutlined /> Name</Space>}>
                                    <Text strong>{user.organization_name}</Text>
                                </Descriptions.Item>
                                {user.website_url && (
                                    <Descriptions.Item label={<Space><GlobalOutlined /> Website</Space>}>
                                        <a
                                            href={user.website_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: '#6366f1', fontWeight: 600 }}
                                        >
                                            {user.website_url} ↗
                                        </a>
                                    </Descriptions.Item>
                                )}
                            </Descriptions>
                            {user.organization_description && (
                                <>
                                    <Divider style={{ margin: '12px 0' }} />
                                    <Text type="secondary" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                                        Description
                                    </Text>
                                    <Paragraph style={{ marginTop: 8, marginBottom: 0, lineHeight: 1.8 }}>
                                        {user.organization_description}
                                    </Paragraph>
                                </>
                            )}
                        </Card>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default Profile;
