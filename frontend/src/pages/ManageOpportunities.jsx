// KEEP THIS ENTIRE VERSION (MAIN BRANCH VERSION)

import React, { useState, useEffect } from 'react';
import {
    Table, Tag, Badge, Button, Modal, Form, Input, Select,
    notification, Tooltip, List, Avatar, Space, Spin, Empty,
    Card, Row, Col, Statistic, Typography,
} from 'antd';
import {
    EditOutlined, DeleteOutlined, TeamOutlined,
    CheckCircleOutlined, CloseCircleOutlined, PlusOutlined,
    EnvironmentOutlined, ClockCircleOutlined,
    AppstoreOutlined, FilterOutlined,
} from '@ant-design/icons';
import './ManageOpportunities.css';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

const initialOpportunities = [
    {
        id: '1',
        title: 'English Teacher for Underprivileged Kids',
        description: 'We are looking for patient and experienced English teachers to help underprivileged children improve their language skills in after-school programs.',
        skills: ['Teaching', 'English', 'Patience'],
        location: 'Mumbai, India',
        duration: '3 Months',
        status: 'Open',
        createdAt: '2024-10-15',
        applicants: [],
    },
    {
        id: '2',
        title: 'Website Redesign Volunteer',
        description: 'Help us redesign and rebuild our NGO website.',
        skills: ['Web Design', 'UI/UX', 'React'],
        location: 'Remote',
        duration: '1 Month',
        status: 'Closed',
        createdAt: '2024-09-01',
        applicants: [],
    }
];

const ManageOpportunities = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [currentOpportunity, setCurrentOpportunity] = useState(null);
    const [createForm] = Form.useForm();
    const [editForm] = Form.useForm();

    useEffect(() => {
        setTimeout(() => {
            setOpportunities(initialOpportunities);
            setLoading(false);
        }, 500);
    }, []);

    const filteredOpportunities = opportunities.filter(opp => {
        if (filter === 'All') return true;
        return opp.status === filter;
    });

    const openCount = opportunities.filter(o => o.status === 'Open').length;
    const closedCount = opportunities.filter(o => o.status === 'Closed').length;

    const handleCreateSubmit = (values) => {
        const newOpp = {
            id: String(Date.now()),
            ...values,
            skills: values.skills || [],
            applicants: [],
            createdAt: new Date().toISOString().split('T')[0],
        };
        setOpportunities(prev => [newOpp, ...prev]);
        createForm.resetFields();
        setIsCreateModalVisible(false);
        notification.success({ message: 'Opportunity Created' });
    };

    const showEditModal = (record) => {
        setCurrentOpportunity(record);
        editForm.setFieldsValue({ ...record });
        setIsEditModalVisible(true);
    };

    const handleEditSubmit = (values) => {
        setOpportunities(prev =>
            prev.map(o =>
                o.id === currentOpportunity.id ? { ...o, ...values } : o
            )
        );
        setIsEditModalVisible(false);
        notification.success({ message: 'Opportunity Updated' });
    };

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
                        icon={<EditOutlined />}
                        onClick={() => showEditModal(record)}
                    />
                    <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() =>
                            setOpportunities(prev =>
                                prev.filter(o => o.id !== record.id)
                            )
                        }
                    />
                </Space>
            ),
        },
    ];

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
                    <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="location" label="Location" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="status" label="Status" initialValue="Open">
                        <Select>
                            <Option value="Open">Open</Option>
                            <Option value="Closed">Closed</Option>
                        </Select>
                    </Form.Item>
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
                    <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="location" label="Location" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="status" label="Status">
                        <Select>
                            <Option value="Open">Open</Option>
                            <Option value="Closed">Closed</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Save Changes
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ManageOpportunities;