import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Card, Avatar, Typography, Tag, Divider,
    Descriptions, Row, Col, Space, Spin, Empty, Badge, Button, Modal, Form, Input
} from 'antd';
import {
    UserOutlined, MailOutlined, EnvironmentOutlined,
    FileTextOutlined, BankOutlined, GlobalOutlined,
    ToolOutlined, IdcardOutlined, CalendarOutlined
} from '@ant-design/icons';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import './Profile.css';

const { Title, Paragraph, Text } = Typography;

const Profile = () => {
    const { user, setUser, loading } = useContext(AuthContext);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

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

    // 🟢 Open edit modal with current data
    const openEditModal = () => {
        form.setFieldsValue({
            location: user.location,
            bio: user.bio,
            organization_name: user.organization_name,
            organization_description: user.organization_description,
            website_url: user.website_url,
        });
        setIsModalOpen(true);
    };

    // 🟢 Update API call
    const handleUpdate = async (values) => {
        try {
            const res = await api.put("/users/profile", values);
            setUser(res.data);

            setIsModalOpen(false);
            form.resetFields();

            Modal.success({
                title: "Profile Updated",
                content: "Your profile has been updated successfully.",
            });

        } catch (err) {
            Modal.error({
                title: "Update Failed",
                content: err.response?.data?.message || "Something went wrong",
            });
        }
    };

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
                            >
                                {isVolunteer ? 'Volunteer' : 'NGO Account'}
                            </Tag>

                            {user.location && (
                                <Tag icon={<EnvironmentOutlined />} color="default">
                                    {user.location}
                                </Tag>
                            )}

                            {/* ✅ Edit Button added (UI unchanged otherwise) */}
                            <Button size="small" onClick={openEditModal}>
                                Edit Profile
                            </Button>
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
                <Col xs={24} md={14}>
                    <Card title="Contact Information" className="profile-info-card">
                        <Descriptions column={1} colon={false}>
                            <Descriptions.Item label="Email">
                                <Text strong>{user.email}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Location">
                                <Text>{user.location || 'Not specified'}</Text>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>

                <Col xs={24} md={10}>
                    {isVolunteer ? (
                        <Card title="Skills & Expertise" className="profile-info-card">
                            {user.skills && user.skills.length > 0
                                ? user.skills.map((skill, i) => <Tag key={i}>{skill}</Tag>)
                                : <Empty description="No skills added yet" />}
                        </Card>
                    ) : (
                        <Card title="Organization Details" className="profile-info-card">
                            <Descriptions column={1} colon={false}>
                                <Descriptions.Item label="Name">
                                    <Text strong>{user.organization_name}</Text>
                                </Descriptions.Item>
                                {user.website_url && (
                                    <Descriptions.Item label="Website">
                                        <a href={user.website_url} target="_blank" rel="noreferrer">
                                            {user.website_url}
                                        </a>
                                    </Descriptions.Item>
                                )}
                            </Descriptions>
                        </Card>
                    )}
                </Col>
            </Row>

            {/* 🟢 Edit Modal */}
            <Modal
                title="Edit Profile"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form layout="vertical" form={form} onFinish={handleUpdate}>
                    <Form.Item label="Location" name="location">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Bio" name="bio">
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    {!isVolunteer && (
                        <>
                            <Form.Item label="Organization Name" name="organization_name">
                                <Input />
                            </Form.Item>

                            <Form.Item label="Organization Description" name="organization_description">
                                <Input.TextArea rows={3} />
                            </Form.Item>

                            <Form.Item label="Website URL" name="website_url">
                                <Input />
                            </Form.Item>
                        </>
                    )}

                    <Button type="primary" htmlType="submit" block>
                        Save Changes
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default Profile;