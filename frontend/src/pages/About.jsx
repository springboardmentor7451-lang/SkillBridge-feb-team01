import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Row, Col, Typography, Button, Card, Space, Divider } from 'antd';
import {
    HeartOutlined,
    TeamOutlined,
    GlobalOutlined,
    RocketOutlined,
    SafetyOutlined,
    StarOutlined
} from '@ant-design/icons';
import './About.css';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const values = [
    { icon: <HeartOutlined />, title: 'Impact First', desc: 'Every feature we build is aimed at maximizing the social impact of volunteers and NGOs combined.' },
    { icon: <SafetyOutlined />, title: 'Trust & Safety', desc: 'All organizations are verified, and volunteer profiles are reviewed to maintain a safe ecosystem.' },
    { icon: <GlobalOutlined />, title: 'Borderless Collab', desc: 'We connect people across cities, countries, and time zones to create global change together.' },
    { icon: <TeamOutlined />, title: 'Community-Driven', desc: 'Volunteers and NGOs shape our roadmap. We build for the community, with the community.' },
    { icon: <StarOutlined />, title: 'Quality Matches', desc: 'Our intelligent matching surfaces opportunities that truly align with your unique skills and goals.' },
    { icon: <RocketOutlined />, title: 'Continuous Growth', desc: 'We\'re always improving—adding features, reducing friction, and amplifying your impact.' },
];



const About = () => {
    return (
        <Layout className="about-layout">
            <Content>
                {/* Hero */}
                <div className="about-hero">
                    <div className="container">
                        <Row justify="center">
                            <Col xs={24} md={18} lg={14} style={{ textAlign: 'center' }}>
                                <Title level={1} className="about-hero-title">
                                    About <span className="highlight-text">SkillBridge</span>
                                </Title>
                                <Paragraph className="about-hero-subtitle">
                                    We are a platform dedicated to connecting skilled volunteers with non-profit
                                    organizations. Our mission is to amplify social impact through technology
                                    and meaningful collaboration.
                                </Paragraph>
                                <Link to="/register">
                                    <Button type="primary" size="large" className="about-cta-btn">
                                        Join Our Community
                                    </Button>
                                </Link>
                            </Col>
                        </Row>
                    </div>
                </div>



                {/* Mission */}
                <div className="about-mission-section">
                    <div className="container">
                        <Row justify="center" style={{ marginBottom: 48 }}>
                            <Col xs={24} md={16} style={{ textAlign: 'center' }}>
                                <Title level={2}>Our Mission</Title>
                                <Paragraph type="secondary" style={{ fontSize: '1.1rem' }}>
                                    SkillBridge was born from a simple belief: skilled people want to
                                    help, and NGOs need that help — but the two rarely find each other
                                    efficiently. We exist to close that gap.
                                </Paragraph>
                            </Col>
                        </Row>

                        <Divider>Our Core Values</Divider>

                        <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
                            {values.map((val, i) => (
                                <Col key={i} xs={24} sm={12} md={8}>
                                    <Card className="value-card" hoverable>
                                        <div className="value-icon">{val.icon}</div>
                                        <Title level={4} style={{ marginTop: 16, marginBottom: 8 }}>{val.title}</Title>
                                        <Paragraph type="secondary">{val.desc}</Paragraph>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>

                {/* CTA Banner */}
                <div className="about-cta-section">
                    <div className="container">
                        <Row justify="center">
                            <Col xs={24} md={16} style={{ textAlign: 'center' }}>
                                <Title level={2} style={{ color: 'white' }}>Ready to Make an Impact?</Title>
                                <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: 32 }}>
                                    Join hundreds of volunteers and NGOs who are already creating change together.
                                </Paragraph>
                                <Space size="large">
                                    <Link to="/register">
                                        <Button size="large" style={{ background: 'white', color: '#6366f1', fontWeight: 700, border: 'none' }}>
                                            Join as Volunteer
                                        </Button>
                                    </Link>
                                    <Link to="/register">
                                        <Button size="large" ghost>
                                            Register NGO
                                        </Button>
                                    </Link>
                                </Space>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Content>
        </Layout>
    );
};

export default About;
