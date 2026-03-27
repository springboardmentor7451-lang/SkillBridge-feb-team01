import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Card, Spin, Empty, notification, Typography, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { getMyApplications } from '../services/applicationService';
import './MyApplications.css';

const { Title } = Typography;

const MyApplications = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
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

  // Listen for real-time application status updates
  useEffect(() => {
    if (!socket) return;

    const handleStatusUpdate = (data) => {
      // Update local state
      setApplications(prev =>
        prev.map(app =>
          app.id === data.applicationId ? { ...app, status: data.status } : app
        )
      );

      // Show toast notification based on status
      if (data.status === 'Accepted') {
        message.success({
          content: (
            <span>
              <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
              Great news! Your application for <strong>{data.opportunityTitle}</strong> has been accepted!
            </span>
          ),
          duration: 6,
        });
      } else if (data.status === 'Rejected') {
        message.info({
          content: (
            <span>
              <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
              Your application for <strong>{data.opportunityTitle}</strong> was not accepted this time
            </span>
          ),
          duration: 6,
        });
      }
    };

    socket.on('application:statusUpdated', handleStatusUpdate);

    return () => {
      socket.off('application:statusUpdated', handleStatusUpdate);
    };
  }, [socket]);

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
