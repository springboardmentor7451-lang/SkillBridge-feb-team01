import React, { useState, useEffect } from 'react';
import { Modal, List, Tag, Button, Space, Spin, Empty, notification, Typography, Avatar, message } from 'antd';
import { UserOutlined, CheckOutlined, CloseOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import {
  getApplicationsByOpportunity,
  acceptApplication,
  rejectApplication,
} from '../services/applicationService';
import { useSocket } from '../context/SocketContext';

const { Text, Paragraph } = Typography;

const ApplicationModal = ({ visible, onClose, opportunityId, opportunityTitle }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const { socket } = useSocket();

  useEffect(() => {
    if (visible && opportunityId) {
      fetchApplications();
    }
  }, [visible, opportunityId]);

  // Listen for real-time application status updates
  useEffect(() => {
    if (!socket) return;

    const handleStatusUpdate = (data) => {
      // Update local state when status changes
      setApplications(prev =>
        prev.map(app =>
          app.id === data.applicationId ? { ...app, status: data.status } : app
        )
      );
    };

    socket.on('application:statusUpdated', handleStatusUpdate);

    return () => {
      socket.off('application:statusUpdated', handleStatusUpdate);
    };
  }, [socket]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await getApplicationsByOpportunity(opportunityId);
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

  const handleAccept = async (applicationId, applicantName) => {
    setActionLoading(prev => ({ ...prev, [applicationId]: true }));
    try {
      await acceptApplication(applicationId);
      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId ? { ...app, status: 'Accepted' } : app
        )
      );
      
      // Show success toast with applicant name
      message.success({
        content: (
          <span>
            <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
            Application from <strong>{applicantName}</strong> has been accepted!
          </span>
        ),
        duration: 4,
      });
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to accept application',
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [applicationId]: false }));
    }
  };

  const handleReject = async (applicationId, applicantName) => {
    setActionLoading(prev => ({ ...prev, [applicationId]: true }));
    try {
      await rejectApplication(applicationId);
      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId ? { ...app, status: 'Rejected' } : app
        )
      );
      
      // Show info toast with applicant name
      message.info({
        content: (
          <span>
            <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
            Application from <strong>{applicantName}</strong> has been rejected
          </span>
        ),
        duration: 4,
      });
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to reject application',
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [applicationId]: false }));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: { color: 'warning' },
      Accepted: { color: 'success' },
      Rejected: { color: 'error' },
    };
    return <Tag color={statusConfig[status]?.color}>{status}</Tag>;
  };

  return (
    <Modal
      title={`Applications for: ${opportunityTitle}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      ) : applications.length === 0 ? (
        <Empty description="No applications yet" />
      ) : (
        <List
          dataSource={applications}
          renderItem={(app) => (
            <List.Item
              key={app.id}
              actions={[
                <Space key="actions">
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={() => handleAccept(app.id, app.applicantName || app.name)}
                    disabled={app.status !== 'Pending'}
                    loading={actionLoading[app.id]}
                  >
                    Accept
                  </Button>
                  <Button
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => handleReject(app.id, app.applicantName || app.name)}
                    disabled={app.status !== 'Pending'}
                    loading={actionLoading[app.id]}
                  >
                    Reject
                  </Button>
                </Space>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={
                  <Space>
                    <Text strong>{app.applicantName || app.name}</Text>
                    {getStatusBadge(app.status)}
                  </Space>
                }
                description={
                  <div>
                    {app.skills && app.skills.length > 0 && (
                      <div style={{ marginBottom: 8 }}>
                        {app.skills.map((skill, idx) => (
                          <Tag key={idx}>{skill}</Tag>
                        ))}
                      </div>
                    )}
                    {app.bio && (
                      <Paragraph
                        ellipsis={{ rows: 2, expandable: true }}
                        style={{ marginBottom: 0 }}
                      >
                        {app.bio}
                      </Paragraph>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Modal>
  );
};

export default ApplicationModal;
