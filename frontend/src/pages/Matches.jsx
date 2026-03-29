import React, { useContext, useState, useEffect } from 'react';
import {
    Row, Col, Typography, Button, Card, Tag, Space,
    Spin, Empty, Alert, message
} from 'antd';
import {
    EnvironmentOutlined,
    ClockCircleOutlined,
    StarFilled,
    ThunderboltOutlined,
    MessageOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../services/api';
import './Matches.css';

const { Title, Text } = Typography;

/**
 * Compute percentage of volunteer skills that match opportunity's required skills.
 * Returns 0 if no required skills listed.
 */
const computeMatchScore = (userSkills = [], requiredSkills = []) => {
    if (!requiredSkills.length) return 0;
    const lowerUser = userSkills.map(s => s.toLowerCase());
    const matched = requiredSkills.filter(s => lowerUser.includes(s.toLowerCase()));
    return Math.round((matched.length / requiredSkills.length) * 100);
};

const getMatchTag = (score) => {
    if (score >= 70) return { label: `High Match · ${score}%`, color: 'success' };
    if (score >= 40) return { label: `Medium · ${score}%`, color: 'warning' };
    return { label: `Low · ${score}%`, color: 'error' };
};

const Matches = () => {
    const navigate = useNavigate();
    const { user, token } = useContext(AuthContext);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [applying, setApplying] = useState(null); // stores opp._id being applied to
    const [myApplications, setMyApplications] = useState([]);

    useEffect(() => {
        fetchMatches();
        if (user && token) fetchMyApplications();
    }, [user]);

    const fetchMyApplications = async () => {
        try {
            const res = await axios.get(`${API_URL}/applications/my`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMyApplications(res.data || []);
        } catch {
            // silently fail
        }
    };

    const fetchMatches = async () => {
        try {
            setLoading(true);
            setLoadError('');
            // Fallback to working opportunities endpoint since /match/opportunities is missing on backend
            const res = await axios.get(`${API_URL}/opportunities`);
            const userSkills = user?.skills || [];

            const mapped = res.data.map(opp => {
                // Ensure mapping aligns with project spec: title, organization_name, required_skills, location, match score
                const requiredSkills = opp.required_skills || opp.skillsRequired || [];
                const organizationName = opp.organization_name || opp.createdBy?.organization_name || 'Organization';
                const matchScore = opp.match_score || opp.matchScore || computeMatchScore(userSkills, requiredSkills);
                
                return {
                    ...opp,
                    organization_name: organizationName,
                    required_skills: requiredSkills,
                    matchScore: matchScore
                };
            });

            // Sort best match first
            mapped.sort((a, b) => b.matchScore - a.matchScore);
            setMatches(mapped);
        } catch (err) {
            console.error('Error fetching matches:', err);
            const msg = err.response?.data?.message || 'Failed to load matched opportunities.';
            setLoadError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (opp) => {
        if (!user) {
            message.info('Please log in to apply.');
            return;
        }
        try {
            setApplying(opp._id);
            await axios.post(
                `${API_URL}/applications`,
                { opportunity_id: opp._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            message.success('Application submitted!');
            setMyApplications(prev => [...prev, { opportunity_id: opp._id, status: 'pending' }]);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to submit application.';
            message.error(msg);
        } finally {
            setApplying(null);
        }
    };

    return (
        <div className="matches-page">
            {/* Page Header */}
            <div className="matches-header">
                <div className="matches-header-left">
                    <Title level={3} style={{ margin: 0 }}>
                        <ThunderboltOutlined style={{ color: '#0f6fff', marginRight: 8 }} />
                        My Matches
                    </Title>
                    <Text type="secondary">
                        Opportunities ranked by how well they match your skill set
                    </Text>
                </div>
                <Tag color="blue" style={{ fontSize: 13, padding: '4px 12px' }}>
                    {matches.length} opportunities found
                </Tag>
            </div>

            {/* Error */}
            {loadError && (
                <Alert
                    type="error"
                    showIcon
                    message="Could not load opportunities"
                    description={loadError}
                    style={{ marginBottom: 24 }}
                    action={
                        <Button size="small" onClick={fetchMatches}>
                            Retry
                        </Button>
                    }
                />
            )}

            {/* Loading */}
            {loading ? (
                <div className="matches-center">
                    <Spin size="large" tip="Finding your best matches…" />
                </div>
            ) : matches.length === 0 && !loadError ? (
                <div className="matches-center">
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <span>
                                No opportunities found. Try updating your&nbsp;
                                <a href="/profile">profile skills</a>.
                            </span>
                        }
                    />
                </div>
            ) : (
                <Row gutter={[24, 24]}>
                    {matches.map(opp => {
                        const { label, color } = getMatchTag(opp.matchScore);

                        return (
                            <Col key={opp._id} xs={24} sm={12} lg={8}>
                                <Card hoverable className="match-card">
                                    {/* Match badge + score bar */}
                                    <div className="match-card-top">
                                        <Tag
                                            color={color}
                                            icon={<StarFilled />}
                                            className="match-badge"
                                        >
                                            {label}
                                        </Tag>
                                        <div className="match-bar-wrap">
                                            <div
                                                className="match-bar-fill"
                                                style={{
                                                    width: `${opp.matchScore}%`,
                                                    background:
                                                        opp.matchScore >= 70
                                                            ? '#10b981'
                                                            : opp.matchScore >= 40
                                                            ? '#f59e0b'
                                                            : '#ef4444',
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <Title level={4} className="match-card-title">
                                        {opp.title}
                                    </Title>

                                    {/* NGO name */}
                                    <Text type="secondary" className="match-card-org">
                                        {opp.organization_name}
                                    </Text>

                                    {/* Location + Duration */}
                                    <div className="match-meta">
                                        <Space>
                                            <EnvironmentOutlined />
                                            <Text type="secondary">{opp.location || '—'}</Text>
                                        </Space>
                                        <Space>
                                            <ClockCircleOutlined />
                                            <Text type="secondary">{opp.duration || '—'}</Text>
                                        </Space>
                                    </div>

                                    {/* Required skills */}
                                    <div className="match-skills">
                                        {(opp.required_skills || []).map(skill => {
                                            const userHas = (user?.skills || [])
                                                .map(s => s.toLowerCase())
                                                .includes(skill.toLowerCase());
                                            return (
                                                <Tag
                                                    key={skill}
                                                    color={userHas ? 'geekblue' : 'default'}
                                                    className="skill-tag"
                                                >
                                                    {skill}
                                                </Tag>
                                            );
                                        })}
                                    </div>

                                    {/* Additional Data for required variables */}
                                    {(()=>{
                                        const oppApp = myApplications.find(a => 
                                            (a.opportunity_id?._id || a.opportunity_id) === opp._id
                                        );
                                        const isApplied = !!oppApp;
                                        const appStatus = oppApp?.status;
                                        const isApplying = applying === opp._id;
                                        
                                        return (
                                            <>
                                                {appStatus === 'accepted' ? (
                                                    <Button
                                                        type="primary"
                                                        block
                                                        icon={<MessageOutlined />}
                                                        onClick={() => navigate(`/chat?userId=${opp.createdBy?._id || opp.createdBy}&name=${encodeURIComponent(opp.organization_name)}`)}
                                                        style={{ marginTop: 16, background: '#10b981', borderColor: '#10b981' }}
                                                    >
                                                        Message NGO
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        type={isApplied ? 'default' : 'primary'}
                                                        block
                                                        disabled={isApplied}
                                                        loading={isApplying}
                                                        onClick={() => handleApply(opp)}
                                                        style={{ marginTop: 16 }}
                                                    >
                                                        {isApplied ? (appStatus === 'rejected' ? '❌ Rejected' : '✓ Applied') : 'Apply Now'}
                                                    </Button>
                                                )}
                                            </>
                                        );
                                    })()}
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </div>
    );
};

export default Matches;
