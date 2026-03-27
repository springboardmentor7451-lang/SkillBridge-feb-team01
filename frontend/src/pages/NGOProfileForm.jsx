import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  notification,
  Divider,
  Row,
  Col,
  Space,
  Avatar,
  Spin,
} from 'antd';
import {
  BankOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './NGOProfileForm.css';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const benefits = [
  'Free to register — no fees ever',
  'Access to verified volunteer pool',
  'Easy opportunity management tools',
  'Direct messaging with applicants',
  'Analytics and impact reporting',
];

function NGOProfileForm() {
  const [form] = Form.useForm();
  const { user, loading, setUser } = useContext(AuthContext);
  const [saving, setSaving] = useState(false);

  // Pre-fill form from logged-in user's profile data
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        organizationName: user.organization_name || '',
        description: user.organization_description || '',
        websiteUrl: user.website_url || '',
        location: user.location || '',
        shortBio: user.bio || '',
      });
    }
  }, [user, form]);

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const payload = {
        organization_name: values.organizationName,
        organization_description: values.description,
        website_url: values.websiteUrl,
        location: values.location,
        bio: values.shortBio,
      };

      const res = await axios.put(
        'http://127.0.0.1:5000/api/users/profile',
        payload
      );

      if (typeof setUser === 'function') {
        setUser(res.data);
      }

      notification.success({
        message: 'Profile Saved!',
        description: 'Your NGO profile has been successfully updated.',
        icon: <CheckCircleOutlined style={{ color: '#10b981' }} />,
      });
    } catch (err) {
      console.error('Save profile error:', err);
      notification.error({
        message: 'Save Failed',
        description:
          err?.response?.data?.message ||
          'Could not save profile. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 300,
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="ngo-page">
      <Row gutter={[24, 24]}>
        {/* Left Info Panel */}
        <Col xs={24} md={8} lg={7}>
          <Card className="ngo-info-card">
            <div className="ngo-info-top">
              <Avatar
                size={56}
                style={{
                  background:
                    'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                }}
              >
                <BankOutlined />
              </Avatar>

              <Title level={4} style={{ margin: '16px 0 6px' }}>
                NGO Profile
              </Title>

              <Paragraph type="secondary" style={{ marginBottom: 24 }}>
                {user?.organization_name
                  ? `Editing profile for ${user.organization_name}`
                  : 'Complete your profile to attract the best volunteers.'}
              </Paragraph>
            </div>

            <Divider style={{ margin: '0 0 20px' }} />

            <div>
              {benefits.map((item, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <CheckCircleOutlined
                    style={{ color: '#10b981', marginRight: 8 }}
                  />
                  <Text>{item}</Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Right Form Panel */}
        <Col xs={24} md={16} lg={17}>
          <Card className="ngo-form-card">
            <Title level={4} style={{ marginBottom: 4 }}>
              Organization Information
            </Title>

            <Paragraph type="secondary" style={{ marginBottom: 28 }}>
              This information is pre-filled from your registration.
              Update as needed and save.
            </Paragraph>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              scrollToFirstError
              size="large"
            >
              <Divider plain>Basic Details</Divider>

              <Form.Item
                name="organizationName"
                label="Organization Name"
                rules={[
                  { required: true, message: 'Organization name is required.' },
                  { min: 3, message: 'Must be at least 3 characters.' },
                ]}
              >
                <Input
                  prefix={<BankOutlined />}
                  placeholder="GreenEarth Foundation"
                />
              </Form.Item>

              <Form.Item
                name="description"
                label="Organization Description"
                rules={[
                  { required: true, message: 'Description is required.' },
                  { min: 20, message: 'Must be at least 20 characters.' },
                ]}
              >
                <TextArea
                  autoSize={{ minRows: 4, maxRows: 8 }}
                  maxLength={600}
                  showCount
                />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="websiteUrl"
                    label="Website URL"
                    rules={[
                      { required: true, message: 'Website URL is required.' },
                      {
                        validator: (_, value) => {
                          if (!value) return Promise.resolve();
                          try {
                            const url = new URL(value);
                            if (!url.protocol.startsWith('http')) {
                              return Promise.reject(
                                'Enter a valid URL with http/https.'
                              );
                            }
                            return Promise.resolve();
                          } catch {
                            return Promise.reject(
                              'Enter a valid URL.'
                            );
                          }
                        },
                      },
                    ]}
                  >
                    <Input
                      prefix={<GlobalOutlined />}
                      placeholder="https://example.org"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="location"
                    label="Location"
                    rules={[
                      { required: true, message: 'Location is required.' },
                    ]}
                  >
                    <Input
                      prefix={<EnvironmentOutlined />}
                      placeholder="City, Country"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider plain>Additional Info (Optional)</Divider>

              <Form.Item
                name="shortBio"
                label="Short Tagline"
                tooltip={{
                  title:
                    'A short sentence describing your NGO.',
                  icon: <InfoCircleOutlined />,
                }}
              >
                <Input
                  prefix={<InfoCircleOutlined />}
                  maxLength={120}
                  showCount
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={saving}
                  >
                    Save Profile
                  </Button>

                  <Button onClick={() => form.resetFields()}>
                    Reset
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default NGOProfileForm;