import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Row, Col, Typography, Button, Card, Space, Timeline, Tag } from 'antd';
import {
    CheckCircleOutlined,
    TeamOutlined,
    FileTextOutlined,
    RocketOutlined,
    BankOutlined,
    GlobalOutlined,
    BarChartOutlined
} from '@ant-design/icons';
import './Organizations.css';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const benefits = [
    { icon: <TeamOutlined />, title: 'Access to Skilled Volunteers', desc: 'Tap into a pool of verified, skilled professionals who are eager to contribute.' },
    { icon: <FileTextOutlined />, title: 'Easy Opportunity Posting', desc: 'Post projects, define skill requirements, and receive applicants seamlessly.' },
    { icon: <BarChartOutlined />, title: 'Track Impact', desc: 'Monitor active volunteers, project progress, and the overall reach of your NGO.' },
    { icon: <GlobalOutlined />, title: 'Global Reach', desc: 'Find remote volunteers from across the world to amplify your mission.' },
    { icon: <RocketOutlined />, title: 'Fast Matching', desc: 'Our platform surfaces the most relevant volunteers for your specific needs quickly.' },
    { icon: <CheckCircleOutlined />, title: 'Trusted & Secure', desc: 'All volunteer profiles are reviewed, ensuring a trustworthy community.' },
];

const howItWorksSteps = [
    { title: 'Register Your NGO', desc: 'Create a free account and complete your organization profile.' },
    { title: 'Post Opportunities', desc: 'Describe your project, required skills, location, and duration.' },
    { title: 'Review Applications', desc: 'Browse applicant profiles and accept the best matches for your team.' },
    { title: 'Collaborate & Succeed', desc: 'Work together, complete your project, and create meaningful impact.' },
];

const Organizations = () => {
    return (
        <Layout className="orgs-layout">
            <Content>
                {/* Hero */}
                <div className="orgs-hero">
                    <div className="container">
                        <Row justify="center">
                            <Col xs={24} md={18} lg={13} style={{ textAlign: 'center' }}>
                                <div className="orgs-hero-badge">
                                    <BankOutlined style={{ marginRight: 8 }} /> For NGOs & Non-profits
                                </div>
                                <Title level={1} className="orgs-hero-title">
                                    Empower Your <br />
                                    <span className="orgs-highlight">Non-Profit Mission</span>
                                </Title>
                                <Paragraph className="orgs-hero-subtitle">
                                    Find skilled volunteers passionate about your cause.
                                    Post opportunities, manage applications, and make a bigger impact together.
                                </Paragraph>
                                <Space size="large">
                                    <Link to="/register">
                                        <Button type="primary" size="large" className="orgs-cta-btn">
                                            Register Your NGO
                                        </Button>
                                    </Link>
                                    <Link to="/opportunities">
                                        <Button size="large" style={{ borderColor: '#6366f1', color: '#6366f1', fontWeight: 600 }}>
                                            Browse Volunteers
                                        </Button>
                                    </Link>
                                </Space>
                            </Col>
                        </Row>
                    </div>
                </div>

                {/* Benefits */}
                <div className="orgs-benefits-section">
                    <div className="container">
                        <Row justify="center" style={{ marginBottom: 48 }}>
                            <Col xs={24} md={16} style={{ textAlign: 'center' }}>
                                <Title level={2}>Why NGOs Choose SkillBridge</Title>
                                <Paragraph type="secondary" style={{ fontSize: '1.05rem' }}>
                                    Everything you need to find, manage and collaborate with skilled volunteers.
                                </Paragraph>
                            </Col>
                        </Row>
                        <Row gutter={[24, 24]}>
                            {benefits.map((b, i) => (
                                <Col key={i} xs={24} sm={12} md={8}>
                                    <Card className="benefit-card" hoverable>
                                        <div className="benefit-icon">{b.icon}</div>
                                        <Title level={4} style={{ marginTop: 16, marginBottom: 8 }}>{b.title}</Title>
                                        <Paragraph type="secondary">{b.desc}</Paragraph>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>

                {/* How it works */}
                <div className="orgs-how-section">
                    <div className="container">
                        <Row gutter={[48, 40]} align="middle">
                            <Col xs={24} md={12}>
                                <Title level={2}>How It Works</Title>
                                <Paragraph type="secondary" style={{ fontSize: '1.05rem', marginBottom: 32 }}>
                                    Getting started is quick and free. You'll be up and running in minutes.
                                </Paragraph>
                                <Timeline
                                    items={howItWorksSteps.map((step, i) => ({
                                        color: '#0f6fff',
                                        content: (
                                            <div>
                                                <Text strong style={{ fontSize: '1rem' }}>
                                                    {i + 1}. {step.title}
                                                </Text>
                                                <Paragraph type="secondary" style={{ marginTop: 4, marginBottom: 0 }}>
                                                    {step.desc}
                                                </Paragraph>
                                            </div>
                                        ),
                                    }))}
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <Card className="orgs-cta-card">
                                    <BankOutlined className="orgs-cta-card-icon" />
                                    <Title level={3} style={{ textAlign: 'center', marginBottom: 16 }}>
                                        Ready to Get Started?
                                    </Title>
                                    <Paragraph type="secondary" style={{ textAlign: 'center', marginBottom: 28 }}>
                                        Create your NGO account for free. No credit card required.
                                    </Paragraph>
                                    <Link to="/register" style={{ display: 'block' }}>
                                        <Button type="primary" size="large" block className="orgs-cta-btn">
                                            Register Your NGO Free
                                        </Button>
                                    </Link>
                                    <div style={{ marginTop: 16, textAlign: 'center' }}>
                                        {['Free to Join', 'Verified Volunteers', 'No Commitment'].map(tag => (
                                            <Tag key={tag} color="geekblue" style={{ marginBottom: 4 }}>{tag}</Tag>
                                        ))}
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Content>
        </Layout>
    );
};

export default Organizations;
