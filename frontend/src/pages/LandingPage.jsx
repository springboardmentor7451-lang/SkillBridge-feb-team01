import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Row, Col, Typography, Button, Space, Card } from 'antd';
import { SearchOutlined, TeamOutlined, NotificationOutlined, ArrowRightOutlined } from '@ant-design/icons';
import './LandingPage.css';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const LandingPage = () => {
    return (
        <Layout className="landing-layout">
            <Content>
                {/* Hero Section */}
                <div className="hero-section">
                    <div className="container">
                        <Row justify="center" align="middle" className="hero-row">
                            <Col xs={24} md={18} lg={14} className="hero-content">
                                <div className="hero-badge">
                                    <span className="hero-badge-dot" />
                                    Connecting Skills with Purpose
                                </div>
                                <Title level={1} className="hero-title">
                                    Bridge Skills &amp; <span className="highlight-text">Grow Impact</span>
                                </Title>
                                <Paragraph className="hero-subtitle">
                                    A platform where skilled volunteers connect with NGOs for short-term or long-term opportunities.
                                    Join us to offer your skills or post impact projects today.
                                </Paragraph>
                                <div className="hero-actions">
                                    <Link to="/register">
                                        <Button type="primary" size="large" className="cta-button">
                                            Join as Volunteer <ArrowRightOutlined />
                                        </Button>
                                    </Link>
                                    <Link to="/register">
                                        <Button size="large" className="cta-button-secondary">
                                            Join as NGO
                                        </Button>
                                    </Link>
                                </div>

                            </Col>
                        </Row>
                    </div>
                </div>

                {/* Features Section */}
                <div className="features-section">
                    <div className="container">
                        <div className="features-header">
                            <span className="features-label">Why SkillBridge</span>
                            <Title level={2} className="features-title">
                                Everything You Need to Make<br />a Real Difference
                            </Title>
                            <Paragraph className="features-subtitle">
                                From discovery to collaboration — our platform makes volunteering effortless.
                            </Paragraph>
                        </div>
                        <Row gutter={[28, 28]} justify="center">
                            <Col xs={24} sm={12} md={8}>
                                <Card className="feature-card" hoverable>
                                    <div className="feature-icon-wrapper">
                                        <SearchOutlined className="ant-icon" />
                                    </div>
                                    <Title level={4}>Find Opportunities</Title>
                                    <Paragraph type="secondary">
                                        Browse skill-based volunteering roles that perfectly match your expertise and passion.
                                    </Paragraph>
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Card className="feature-card" hoverable>
                                    <div className="feature-icon-wrapper">
                                        <TeamOutlined className="ant-icon" />
                                    </div>
                                    <Title level={4}>Connect with NGOs</Title>
                                    <Paragraph type="secondary">
                                        Directly collaborate with verified non-profits for meaningful short-term or long-term projects.
                                    </Paragraph>
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Card className="feature-card" hoverable>
                                    <div className="feature-icon-wrapper">
                                        <NotificationOutlined className="ant-icon" />
                                    </div>
                                    <Title level={4}>Post Requirements</Title>
                                    <Paragraph type="secondary">
                                        NGOs can easily post their skilled requirements and find the right talent quickly and securely.
                                    </Paragraph>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Content>
        </Layout>
    );
};

export default LandingPage;
