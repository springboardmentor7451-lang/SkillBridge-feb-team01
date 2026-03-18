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
} from '@ant-design/icons';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { API_URL } from '../services/api';
import ApplicationModal from '../components/ApplicationModal';
import './ManageOpportunities.css';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

const ManageOpportunities = () => {
    const { token } = useContext(AuthContext);
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [filter, setFilter] = useState('All');

    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isApplicationModalVisible, setIsApplicationModalVisible] = useState(false);
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

    const openCount = opportunities.filter(o => o.status === 'Open').length;
    const closedCount = opportunities.filter(o => o.status === 'Closed').length;

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

    // ── View Applications (using ApplicationModal component) ──
    const showApplicationModal = (record) => {
        setCurrentOpportunity(record);
        setIsApplicationModalVisible(true);
    };

    // ── Table columns ──
    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: status => (
                <Badge
                    status={status === 'Open' ? 'success' : 'error'}
                    text={status}
                />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<TeamOutlined />}
                        onClick={() => showApplicationModal(record)}
                    >
                        View Applications
                    </Button>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => showEditModal(record)}
                    />
                    <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDeleteClose(record)}
                    />
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
        <div>
            <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col span={8}>
                    <Card>
                        <Statistic title="Total" value={opportunities.length} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title="Open" value={openCount} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title="Closed" value={closedCount} />
                    </Card>
                </Col>
            </Row>

            <Card>
                <Space style={{ marginBottom: 16 }}>
                    <Select value={filter} onChange={setFilter}>
                        <Option value="All">All</Option>
                        <Option value="Open">Open</Option>
                        <Option value="Closed">Closed</Option>
                    </Select>

                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsCreateModalVisible(true)}
                    >
                        Create Opportunity
                    </Button>
                </Space>

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
                    <Spin />
                ) : filteredOpportunities.length === 0 ? (
                    <Empty />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={filteredOpportunities}
                        rowKey="id"
                        pagination={{ pageSize: 5 }}
                    />
                )}
            </Card>

            <Modal
                title="Create Opportunity"
                open={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                footer={null}
            >
                <Form form={createForm} layout="vertical" onFinish={handleCreateSubmit}>
                    <SharedFormFields />
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Create
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Edit Opportunity"
                open={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null}
            >
                <Form form={editForm} layout="vertical" onFinish={handleEditSubmit}>
                    <SharedFormFields />
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Save Changes
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <ApplicationModal
                visible={isApplicationModalVisible}
                onClose={() => setIsApplicationModalVisible(false)}
                opportunityId={currentOpportunity?.id}
                opportunityTitle={currentOpportunity?.title}
            />
        </div>
    );
};

export default ManageOpportunities;
