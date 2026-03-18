import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Card, Spin, Empty, notification, Typography } from 'antd';
import { useAuth } from '../context/AuthContext';
import { getMyApplications } from '../services/applicationService';
import './MyApplications.css';

const { Title } = Typography;

const MyApplications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'volunteer') {
      navigate('/');
      return;
    }
    fetchApplications();
  }, [user, navigate]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await getMyApplications();
      setApplications(data);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to load applications',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      Pending: { color: 'warning' },
      Accepted: { color: 'success' },
      Rejected: { color: 'error' },
    };
    return <Tag color={statusConfig[status]?.color}>{status}</Tag>;
  };

  const columns = [
    {
      title: 'Opportunity',
      dataIndex: 'opportunityTitle',
      key: 'opportunityTitle',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'NGO',
      dataIndex: 'ngoName',
      key: 'ngoName',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Applied Date',
      dataIndex: 'appliedDate',
      key: 'appliedDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  if (loading) {
    return (
      <div className="my-applications-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="my-applications-container">
      <Card>
        <Title level={2}>My Applications</Title>
        {applications.length === 0 ? (
          <Empty description="You haven't applied to any opportunities yet" />
        ) : (
          <Table
            columns={columns}
            dataSource={applications}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>
    </div>
  );
};

export default MyApplications;
