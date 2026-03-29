import React, { useState, useEffect, useContext } from 'react';
import {
    Table, Tag, Badge, Button, Modal, Form, Input, Select,
    notification, Tooltip, List, Avatar, Space, Spin, Empty,
    Card, Row, Col, Statistic, Typography, Alert,
} from 'antd';
import {
    EditOutlined, DeleteOutlined, TeamOutlined,
    CheckCircleOutlined, CloseCircleOutlined, PlusOutlined,
    EnvironmentOutlined, ClockCircleOutlined,
    AppstoreOutlined, FilterOutlined,
    MessageOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { API_URL } from '../services/api';
import './ManageOpportunities.css';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

const ManageOpportunities = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [filter, setFilter] = useState('All');

    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isApplicantModalVisible, setIsApplicantModalVisible] = useState(false);
    const [currentOpportunity, setCurrentOpportunity] = useState(null);
    const [createForm] = Form.useForm();
    const [editForm] = Form.useForm();

    useEffect(() => {
        if (token) {
            fetchMyOpportunities();
        }
    }, [token]);

    const fetchMyOpportunities = async () => {
        try {
            setLoading(true);
            setLoadError('');
            const response = await axios.get(`${API_URL}/opportunities/my`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Map _id to id, skillsRequired to skills, and capitalize status for the frontend
            const mappedOpportunities = response.data.map(opp => ({
                ...opp,
                id: opp._id,
                skills: opp.skillsRequired || [],
                status: opp.status === 'open' ? 'Open' : 'Closed',
                applicants: opp.applicants || []
            }));
            setOpportunities(mappedOpportunities);
        } catch (error) {
            console.error('Error fetching NGO opportunities:', error);
            const msg = error.response?.data?.message || 'Failed to load opportunities';
            setLoadError(msg);
            notification.error({ message: 'Error', description: msg });
        } finally {
            setLoading(false);
        }
    };

    const filteredOpportunities = opportunities.filter(opp => {
        if (filter === 'All') return true;
        return opp.status === filter;
    });

    // ── Stats ──
    const openCount = opportunities.filter(o => o.status === 'Open').length;
    const closedCount = opportunities.filter(o => o.status === 'Closed').length;
    const totalApplicants = opportunities.reduce((sum, o) => sum + o.applicants.length, 0);

    // ── Create ──
    const handleCreateSubmit = async (values) => {
        try {
            const payload = {
                title: values.title,
                description: values.description,
                location: values.location,
                duration: values.duration,
                skillsRequired: values.skills, // Backend expects skillsRequired
            };

            const response = await axios.post(`${API_URL}/opportunities`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setIsCreateModalVisible(false);
            createForm.resetFields();
            notification.success({ message: 'Opportunity Created', description: `"${values.title}" is now live.` });
            
            // Refetch to get the latest data including MongoDB ID
            fetchMyOpportunities();
        } catch (error) {
            console.error('Error creating opportunity:', error);
            notification.error({ message: 'Error', description: error.response?.data?.message || 'Failed to create opportunity' });
        }
    };

    // ── Edit ──
    const showEditModal = (record) => {
        setCurrentOpportunity(record);
        editForm.setFieldsValue({ ...record, status: record.status.toLowerCase() }); // Backend expects lowercase
        setIsEditModalVisible(true);
    };

    const handleEditSubmit = async (values) => {
        try {
            const payload = {
                title: values.title,
                description: values.description,
                location: values.location,
                duration: values.duration,
                skillsRequired: values.skills,
                status: values.status,
            };

            await axios.put(`${API_URL}/opportunities/${currentOpportunity.id}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setIsEditModalVisible(false);
            notification.success({ message: 'Opportunity Updated', description: 'Changes saved successfully.' });
            fetchMyOpportunities();
        } catch (error) {
            console.error('Error updating opportunity:', error);
            notification.error({ message: 'Error', description: error.response?.data?.message || 'Failed to update opportunity' });
        }
    };

    // ── Delete/Close ──
    const handleDeleteClose = (record) => {
        const isClosed = record.status === 'Closed';
        Modal.confirm({
            title: isClosed ? 'Delete Opportunity?' : 'Close Opportunity?',
            content: isClosed
                ? 'This action is permanent. The opportunity will be removed.'
                : 'This will mark the opportunity as closed.',
            okText: isClosed ? 'Delete' : 'Close It',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    if (isClosed) {
                        await axios.delete(`${API_URL}/opportunities/${record.id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        notification.success({ message: 'Deleted', description: 'The opportunity was removed.' });
                    } else {
                        await axios.put(`${API_URL}/opportunities/${record.id}`, { status: 'closed' }, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        notification.info({ message: 'Closed', description: 'The opportunity is now marked as closed.' });
                    }
                    fetchMyOpportunities();
                } catch (error) {
                    console.error('Action error:', error);
                    notification.error({ message: 'Error', description: 'Failed to complete action' });
                }
            },
        });
    };

    // ── Applicants ──
    const showApplicants = (record) => {
        setCurrentOpportunity(record);
        setIsApplicantModalVisible(true);
    };

    const handleApplicantAction = async (action, applicant) => {
        try {
            const status = action === 'Accept' ? 'accepted' : 'rejected';
            
            await axios.put(`${API_URL}/applications/${applicant.application_id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            notification.success({
                message: `Applicant ${action}ed`,
                description: `You have ${action.toLowerCase()}ed ${applicant.name}.`,
            });

            // Update local state to reflect the change inside the modal without closing it
            setCurrentOpportunity(prev => ({
                ...prev,
                applicants: prev.applicants.map(app => 
                    app.application_id === applicant.application_id ? { ...app, status } : app
                )
            }));
            
            // Also refresh the main list
            fetchMyOpportunities();
        } catch (error) {
            console.error('Action error:', error);
            notification.error({ message: 'Error', description: error.response?.data?.message || 'Failed to process application' });
        }
    };

    // ── Table columns ──
    const columns = [
        {
            title: 'OPPORTUNITY',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <div>
                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>{text}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                        <EnvironmentOutlined style={{ color: '#94a3b8', fontSize: 12 }} />
                        <Text type="secondary" style={{ fontSize: '0.78rem' }}>{record.location}</Text>
                        <ClockCircleOutlined style={{ color: '#94a3b8', fontSize: 12, marginLeft: 8 }} />
                        <Text type="secondary" style={{ fontSize: '0.78rem' }}>{record.duration}</Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'SKILLS',
            dataIndex: 'skills',
            key: 'skills',
            render: skills => (
                <Space size={4} wrap>
                    {skills.map(skill => (
                        <Tag
                            key={skill}
                            style={{
                                background: 'rgba(15, 111, 255, 0.08)',
                                border: '1px solid rgba(15, 111, 255, 0.2)',
                                color: '#0f6fff',
                                borderRadius: 6,
                                fontSize: '0.75rem',
                                fontWeight: 600,
                            }}
                        >
                            {skill}
                        </Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            key: 'status',
            render: status => (
                <Badge
                    status={status === 'Open' ? 'success' : 'error'}
                    text={
                        <span style={{
                            fontWeight: 600,
                            color: status === 'Open' ? '#10b981' : '#ef4444',
                            fontSize: '0.82rem',
                        }}>
                            {status}
                        </span>
                    }
                />
            ),
        },
        {
            title: 'APPLICANTS',
            dataIndex: 'applicants',
            key: 'applicants',
            render: (applicants, record) => (
                <Button
                    type="text"
                    onClick={() => showApplicants(record)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '4px 10px',
                        borderRadius: 8,
                        background: applicants.length > 0 ? 'rgba(15, 111, 255, 0.06)' : 'transparent',
                        color: applicants.length > 0 ? '#0f6fff' : '#94a3b8',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                    }}
                >
                    <TeamOutlined />
                    {applicants.length} {applicants.length === 1 ? 'applicant' : 'applicants'}
                </Button>
            ),
        },
        {
            title: 'ACTIONS',
            key: 'actions',
            fixed: 'right',
            width: 120,
            render: (_, record) => (
                <Space size={4}>
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => showEditModal(record)}
                            className="action-btn-edit"
                        />
                    </Tooltip>
                    <Tooltip title={record.status === 'Closed' ? 'Delete' : 'Close'}>
                        <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteClose(record)}
                            danger
                            className="action-btn-delete"
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const SharedFormFields = () => (
        <>
            <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter a title' }]}>
                <Input placeholder="e.g. English Teacher for Underprivileged Kids" />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter a description' }]}>
                <TextArea rows={3} placeholder="Describe the opportunity..." maxLength={500} showCount />
            </Form.Item>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="location" label="Location" rules={[{ required: true }]}>
                        <Input placeholder="City, Country or Remote" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="duration" label="Duration" rules={[{ required: true }]}>
                        <Input placeholder="e.g. 3 Months" />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item name="skills" label="Required Skills" rules={[{ required: true, message: 'Add at least one skill' }]}>
                <Select mode="tags" placeholder="Type and press Enter to add skills" />
            </Form.Item>
            {isEditModalVisible && (
                <Form.Item name="status" label="Status" initialValue="open">
                    <Select>
                        <Option value="open">Open</Option>
                        <Option value="closed">Closed</Option>
                    </Select>
                </Form.Item>
            )}
        </>
    );

    return (
        <div className="mo-page">
            {/* ── Stats ── */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                {[
                    { title: 'Total Opportunities', value: opportunities.length, icon: <AppstoreOutlined />, color: '#0f6fff' },
                    { title: 'Open Opportunities', value: openCount, icon: <CheckCircleOutlined />, color: '#10b981' },
                    { title: 'Closed', value: closedCount, icon: <CloseCircleOutlined />, color: '#ef4444' },
                    { title: 'Total Applicants', value: totalApplicants, icon: <TeamOutlined />, color: '#8b5cf6' },
                ].map((stat) => (
                    <Col xs={12} md={6} key={stat.title}>
                        <Card className="mo-stat-card">
                            <div className="mo-stat-inner">
                                <div className="mo-stat-icon" style={{ background: `${stat.color}18`, color: stat.color }}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <Statistic
                                        value={stat.value}
                                        valueStyle={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}
                                    />
                                    <Text style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500 }}>{stat.title}</Text>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* ── Table card ── */}
            <Card className="mo-table-card">
                {/* Header */}
                <div className="mo-table-header">
                    <div>
                        <Title level={4} style={{ margin: 0, color: '#0f172a' }}>All Opportunities</Title>
                        <Text type="secondary" style={{ fontSize: '0.82rem' }}>
                            Manage your posted opportunities
                        </Text>
                    </div>
                    <Space>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FilterOutlined style={{ color: '#94a3b8' }} />
                            <Select
                                value={filter}
                                onChange={setFilter}
                                style={{ width: 130 }}
                                options={[
                                    { value: 'All', label: 'All Status' },
                                    { value: 'Open', label: '🟢 Open' },
                                    { value: 'Closed', label: '🔴 Closed' },
                                ]}
                            />
                        </div>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setIsCreateModalVisible(true)}
                            className="create-opp-btn"
                        >
                            Create Opportunity
                        </Button>
                    </Space>
                </div>

                {/* Table */}
                {loadError && !loading && (
                    <div className="mo-alert-wrap">
                        <Alert
                            type="error"
                            showIcon
                            message="Could not load opportunities"
                            description={loadError}
                            action={
                                <Button size="small" onClick={fetchMyOpportunities}>
                                    Retry
                                </Button>
                            }
                        />
                    </div>
                )}

                {loading ? (
                    <div className="mo-loading">
                        <Spin size="large" />
                        <Text type="secondary" style={{ marginTop: 12 }}>Loading opportunities...</Text>
                    </div>
                ) : filteredOpportunities.length === 0 ? (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <Space direction="vertical" align="center">
                                <Text type="secondary">No opportunities found</Text>
                                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)}>
                                    Create Your First
                                </Button>
                            </Space>
                        }
                        style={{ padding: '48px 0' }}
                    />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={filteredOpportunities}
                        rowKey="id"
                        pagination={{ pageSize: 8, showSizeChanger: false, showTotal: (total) => `${total} opportunities` }}
                        scroll={{ x: 700 }}
                        className="mo-table"
                        rowClassName="mo-table-row"
                    />
                )}
            </Card>

            {/* ── Create Opportunity Modal ── */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <PlusOutlined style={{ color: '#0f6fff' }} />
                        <span>Create New Opportunity</span>
                    </div>
                }
                open={isCreateModalVisible}
                onCancel={() => { setIsCreateModalVisible(false); createForm.resetFields(); }}
                footer={null}
                width={600}
                destroyOnClose
            >
                <Form form={createForm} layout="vertical" onFinish={handleCreateSubmit} style={{ marginTop: 16 }}>
                    <SharedFormFields />
                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => { setIsCreateModalVisible(false); createForm.resetFields(); }}>Cancel</Button>
                            <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>Create Opportunity</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* ── Edit Modal ── */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <EditOutlined style={{ color: '#0f6fff' }} />
                        <span>Edit Opportunity</span>
                    </div>
                }
                open={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null}
                width={600}
                destroyOnClose
            >
                <Form form={editForm} layout="vertical" onFinish={handleEditSubmit} style={{ marginTop: 16 }}>
                    <SharedFormFields />
                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setIsEditModalVisible(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit">Save Changes</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* ── Applicants Modal ── */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <TeamOutlined style={{ color: '#8b5cf6' }} />
                        <span>Applicants — {currentOpportunity?.title}</span>
                    </div>
                }
                open={isApplicantModalVisible}
                onCancel={() => setIsApplicantModalVisible(false)}
                footer={<Button onClick={() => setIsApplicantModalVisible(false)}>Close</Button>}
                width={620}
            >
                {currentOpportunity?.applicants?.length > 0 ? (
                    <List
                        itemLayout="horizontal"
                        dataSource={currentOpportunity.applicants}
                        renderItem={item => (
                            <List.Item
                                actions={item.status === 'accepted' ? [
                                    <Button
                                        key="message"
                                        type="primary"
                                        size="small"
                                        icon={<MessageOutlined />}
                                        onClick={() => navigate(`/chat?userId=${item.volunteer_id}&name=${encodeURIComponent(item.name)}`)}
                                        style={{ background: '#0f6fff', borderColor: '#0f6fff' }}
                                    >
                                        Message
                                    </Button>
                                ] : item.status === 'rejected' ? [
                                    <Tag color="error" key="rejected">Rejected</Tag>
                                ] : [
                                    <Button
                                        key="accept"
                                        type="primary"
                                        size="small"
                                        icon={<CheckCircleOutlined />}
                                        onClick={() => handleApplicantAction('Accept', item)}
                                        style={{ background: '#10b981', borderColor: '#10b981' }}
                                    >
                                        Accept
                                    </Button>,
                                    <Button
                                        key="reject"
                                        danger
                                        size="small"
                                        icon={<CloseCircleOutlined />}
                                        onClick={() => handleApplicantAction('Reject', item)}
                                    >
                                        Reject
                                    </Button>,
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <Avatar
                                            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', fontWeight: 700 }}
                                        >
                                            {item.name ? item.name.charAt(0) : '?'}
                                        </Avatar>
                                    }
                                    title={<Text strong>{item.name}</Text>}
                                    description={
                                        <div>
                                            <Paragraph style={{ marginBottom: 6, fontSize: '0.82rem', color: '#64748b' }}>
                                                {item.bio || 'No bio provided'}
                                            </Paragraph>
                                            <Space size={4} wrap>
                                                {item.skills.map(skill => (
                                                    <Tag key={skill} color="blue" style={{ fontSize: '0.72rem' }}>{skill}</Tag>
                                                ))}
                                            </Space>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No applicants yet for this opportunity."
                        style={{ padding: '32px 0' }}
                    />
                )}
            </Modal>
        </div>
    );
};

export default ManageOpportunities;
