import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Row, Col, Typography, Button, Card, Tag, Space, Empty, notification, Spin } from 'antd';
import {
    SearchOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    TeamOutlined,
    FilterOutlined,
    CheckCircleOutlined as SuccessIcon
} from '@ant-design/icons';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './Opportunities.css';

const API_BASE = 'http://127.0.0.1:5000/api';
const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const typeColors = {
    Remote: 'blue',
    'On-site': 'green',
    Hybrid: 'purple',
};

const Opportunities = () => {
    const { user } = useContext(AuthContext);
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                const res = await axios.get(`${API_BASE}/opportunities`);
                const mapped = res.data.map(opp => ({
                    id: opp._id,
                    title: opp.title,
                    org: opp.createdBy?.name || 'Unknown Organization',
                    skills: opp.skillsRequired || [],
                    location: opp.location,
                    duration: opp.duration || '',
                    type: opp.location?.toLowerCase().includes('remote') ? 'Remote' : 'On-site',
                }));
                setOpportunities(mapped);
            } catch (error) {
                console.error('Error fetching opportunities:', error);
                notification.error({ message: 'Error', description: 'Failed to load opportunities.' });
            } finally {
                setLoading(false);
            }
        };
        fetchOpportunities();
    }, []);

    const handleApply = (title) => {
        notification.success({
            message: 'Application Sent!',
            description: `You have successfully applied for "${title}". The organization will review your profile shortly.`,
            placement: 'topRight',
        });
    };

    return (
        <Layout className="opportunities-layout">
            <Content>
                {/* Hero - Only show for guests */}
                {!user && (
                    <div className="opp-hero">
                        <div className="container">
                            <Row justify="center">
                                <Col xs={24} md={18} lg={12} style={{ textAlign: 'center' }}>
                                    <Title level={1} className="opp-hero-title">
                                        Find Your Next <br />
                                        <span className="opp-highlight">Volunteering Opportunity</span>
                                    </Title>
                                    <Paragraph className="opp-hero-subtitle">
                                        Browse through hundreds of impactful projects.
                                        Filter by skills, location, and cause — make a difference where it matters most.
                                    </Paragraph>
                                    <Link to="/register">
                                        <Button type="primary" size="large" icon={<SearchOutlined />} className="opp-cta-btn">
                                            Browse & Apply
                                        </Button>
                                    </Link>
                                </Col>
                            </Row>
                        </div>
                    </div>
                )}

                {/* Listing Section */}
                <div className="opp-list-section">
                    <div className="container">
                        <div className="opp-list-header">
                            <Title level={3} style={{ margin: 0 }}>Featured Opportunities</Title>
                            <Space>
                                <FilterOutlined />
                                <Text type="secondary">Showing {opportunities.length} opportunities</Text>
                            </Space>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                <Spin size="large" />
                                <Text type="secondary" style={{ display: 'block', marginTop: 12 }}>Loading opportunities...</Text>
                            </div>
                        ) : opportunities.length === 0 ? (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="No opportunities available yet. Check back later!"
                                style={{ padding: '60px 0' }}
                            />
                        ) : (
                            <Row gutter={[24, 24]}>
                                {opportunities.map(opp => (
                                    <Col key={opp.id} xs={24} sm={12} lg={8}>
                                        <Card
                                            hoverable
                                            className="opportunity-card"
                                            actions={[
                                                user ? (
                                                    <Button
                                                        type="primary"
                                                        block
                                                        key="apply"
                                                        onClick={() => handleApply(opp.title)}
                                                        icon={<SuccessIcon />}
                                                    >
                                                        Apply Now
                                                    </Button>
                                                ) : (
                                                    <Link to="/register" key="apply" style={{ width: '100%' }}>
                                                        <Button type="primary" block>Apply Now</Button>
                                                    </Link>
                                                )
                                            ]}
                                        >
                                            <div className="opp-card-header">
                                                <Tag color={typeColors[opp.type] || 'default'} className="type-tag">{opp.type}</Tag>
                                            </div>
                                            <Title level={4} className="opp-card-title">{opp.title}</Title>
                                            <Text type="secondary" className="opp-org">{opp.org}</Text>
                                            <div className="opp-meta">
                                                <Space>
                                                    <EnvironmentOutlined />
                                                    <Text type="secondary">{opp.location}</Text>
                                                </Space>
                                                <Space>
                                                    <ClockCircleOutlined />
                                                    <Text type="secondary">{opp.duration}</Text>
                                                </Space>
                                            </div>
                                            <div className="opp-skills">
                                                {opp.skills.map(skill => (
                                                    <Tag key={skill} color="geekblue">{skill}</Tag>
                                                ))}
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}

                        {/* Signup CTA - Only show for guests */}
                        {!user && (
                            <div className="opp-signup-cta">
                                <TeamOutlined className="opp-cta-icon" />
                                <Title level={4}>See All Opportunities</Title>
                                <Paragraph type="secondary" style={{ marginBottom: 24 }}>
                                    Sign up or log in to view all available opportunities and apply directly.
                                </Paragraph>
                                <Link to="/register">
                                    <Button type="primary" size="large">Create Free Account</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </Content>
        </Layout>
    );
};

export default Opportunities;
