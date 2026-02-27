import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Row, Col, Typography, Button, Card, Tag, Space, Empty, notification } from 'antd';
import {
    SearchOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    TeamOutlined,
    FilterOutlined,
    CheckCircleOutlined as SuccessIcon
} from '@ant-design/icons';
import AuthContext from '../context/AuthContext';
import './Opportunities.css';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

// Sample listed opportunities for demonstration
const sampleOpportunities = [
    {
        id: 1,
        title: 'English Teacher for Underprivileged Kids',
        org: 'Bright Futures NGO',
        skills: ['Teaching', 'English', 'Patience'],
        location: 'Mumbai, India',
        duration: '3 Months',
        type: 'On-site',
    },
    {
        id: 2,
        title: 'Website Redesign Volunteer',
        org: 'GreenEarth Foundation',
        skills: ['Web Design', 'UI/UX', 'React'],
        location: 'Remote',
        duration: '1 Month',
        type: 'Remote',
    },
    {
        id: 3,
        title: 'Community Health Camp Volunteer',
        org: 'HealthBridge Africa',
        skills: ['Healthcare', 'First Aid', 'Coordination'],
        location: 'Nairobi, Kenya',
        duration: '2 Weeks',
        type: 'On-site',
    },
    {
        id: 4,
        title: 'Social Media Manager',
        org: 'Clean Oceans Initiative',
        skills: ['Marketing', 'Social Media', 'Content Creation'],
        location: 'Remote',
        duration: '2 Months',
        type: 'Remote',
    },
    {
        id: 5,
        title: 'Legal Aid Consultant',
        org: 'Justice For All',
        skills: ['Law', 'Research', 'Pro-bono'],
        location: 'New York, USA',
        duration: '6 Months',
        type: 'Hybrid',
    },
    {
        id: 6,
        title: 'Data Analyst for Impact Reporting',
        org: 'Feed the Future',
        skills: ['Data Analysis', 'Excel', 'Python'],
        location: 'Remote',
        duration: '3 Months',
        type: 'Remote',
    },
];

const typeColors = {
    Remote: 'blue',
    'On-site': 'green',
    Hybrid: 'purple',
};

const Opportunities = () => {
    const { user } = useContext(AuthContext);

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
                                <Text type="secondary">Showing {sampleOpportunities.length} opportunities</Text>
                            </Space>
                        </div>
                        <Row gutter={[24, 24]}>
                            {sampleOpportunities.map(opp => (
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
