import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Row, Col, Typography, Button, Card, Tag, Space, Modal, Descriptions, Divider, message, Spin, Alert } from 'antd';
import {
    SearchOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    FilterOutlined,
    EyeOutlined
} from '@ant-design/icons';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../services/api';
import './Opportunities.css';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const typeColors = {
    Remote: 'blue',
    'On-site': 'green',
    Hybrid: 'purple',
};

const Opportunities = () => {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [selectedOpp, setSelectedOpp] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        fetchOpportunities();
    }, []);

    const fetchOpportunities = async () => {
        try {
            setLoading(true);
            setLoadError('');
            const response = await axios.get(`${API_URL}/opportunities`);
            setOpportunities(response.data);
        } catch (error) {
            console.error('Error fetching opportunities:', error);
            const msg = error.response?.data?.message || 'Failed to load opportunities';
            setLoadError(msg);
            message.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (opp) => {
        setSelectedOpp(opp);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedOpp(null);
    };

    const handleApply = async () => {
        if (!selectedOpp) {
            message.error('Please select an opportunity first.');
            return;
        }

        if (!user) {
            message.info('Please log in to apply for opportunities');
            navigate('/login');
            return;
        }

        if (user.role !== 'volunteer') {
            message.error('Only volunteers can apply for opportunities');
            return;
        }

        try {
            setApplying(true);
            await axios.post(
                `${API_URL}/applications`,
                { opportunity_id: selectedOpp._id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            message.success('Application submitted successfully!');
            setIsModalVisible(false);
        } catch (error) {
            console.error('Apply error:', error);
            const msg = error.response?.data?.message || 'Failed to submit application';
            message.error(msg);
        } finally {
            setApplying(false);
        }
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
                                            Explore Opportunities
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

                    {loadError && (
                        <Alert
                            type="error"
                            showIcon
                            className="opp-alert"
                            message="Could not load opportunities"
                            description={loadError}
                            action={
                                <Button size="small" onClick={fetchOpportunities}>
                                    Retry
                                </Button>
                            }
                        />
                    )}
                        
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <Spin size="large" />
                        </div>
                        ) : opportunities.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '50px' }}>
                                <Text type="secondary">No opportunities available at the moment.</Text>
                            </div>
                        ) : (
                            <Row gutter={[24, 24]}>
                                {opportunities.map(opp => (
                                    <Col key={opp._id} xs={24} sm={12} lg={8}>
                                        <Card
                                            hoverable
                                            className="opportunity-card"
                                            actions={[
                                                <Button
                                                    type="primary"
                                                    block
                                                    key="view"
                                                    onClick={() => handleViewDetails(opp)}
                                                    icon={<EyeOutlined />}
                                                >
                                                    View Details
                                                </Button>
                                            ]}
                                        >
                                            <div className="opp-card-header">
                                                {/* Use a default tag if type is not available */}
                                                <Tag color={typeColors[opp.type || 'On-site']} className="type-tag">{opp.type || 'On-site'}</Tag>
                                            </div>
                                            <Title level={4} className="opp-card-title">{opp.title}</Title>
                                            <Text type="secondary" className="opp-org">
                                                {opp.createdBy?.organization_name || 'Organization'}
                                            </Text>
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
                                                {opp.skillsRequired && opp.skillsRequired.map(skill => (
                                                    <Tag key={skill} color="geekblue">{skill}</Tag>
                                                ))}
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}

                        {/* Detail Modal */}
                        <Modal
                            title={<Title level={3} style={{ margin: 0 }}>{selectedOpp?.title}</Title>}
                            open={isModalVisible}
                            onCancel={handleCloseModal}
                            footer={[
                                <Button key="close" onClick={handleCloseModal}>
                                    Close
                                </Button>,
                                <Button 
                                    key="apply" 
                                    type="primary" 
                                    onClick={handleApply}
                                    loading={applying}
                                >
                                    Apply Now
                                </Button>
                            ]}
                            width={700}
                            centered
                            className="opp-detail-modal"
                        >
                            {selectedOpp && (
                                <div className="modal-content">
                                    <div style={{ marginBottom: 20 }}>
                                        <Tag color={typeColors[selectedOpp.type || 'On-site']} style={{ fontSize: '0.9rem', padding: '4px 12px', borderRadius: 20 }}>
                                            {selectedOpp.type || 'On-site'}
                                        </Tag>
                                        <span style={{ marginLeft: 12, fontSize: '1rem', color: 'rgba(0, 0, 0, 0.45)' }}>
                                            {selectedOpp.createdBy?.organization_name || 'Organization'}
                                        </span>
                                    </div>

                                    <Descriptions column={1} bordered className="opp-descriptions">
                                        <Descriptions.Item label="Location">
                                            <Space><EnvironmentOutlined />{selectedOpp.location}</Space>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Duration">
                                            <Space><ClockCircleOutlined />{selectedOpp.duration}</Space>
                                        </Descriptions.Item>
                                    </Descriptions>

                                    <Divider orientation="left">Skills Required</Divider>
                                    <div style={{ marginBottom: 24 }}>
                                        {selectedOpp.skillsRequired && selectedOpp.skillsRequired.map(skill => (
                                            <Tag key={skill} color="geekblue" style={{ marginBottom: 8, padding: '4px 12px', borderRadius: 6 }}>
                                                {skill}
                                            </Tag>
                                        ))}
                                    </div>

                                    <Divider orientation="left">Opportunity Description</Divider>
                                    <Paragraph style={{ fontSize: '1.05rem', lineHeight: '1.6', color: '#475569' }}>
                                        {selectedOpp.description}
                                    </Paragraph>
                                </div>
                            )}
                        </Modal>
                    </div>
                </div>
            </Content>
        </Layout>
    );
};

export default Opportunities;

