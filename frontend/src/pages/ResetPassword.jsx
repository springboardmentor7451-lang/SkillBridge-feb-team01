import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert, Card } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './Login.css'; // Reusing login styles for consistency

const { Title, Text } = Typography;

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await api.put(`/auth/resetpassword/${token}`, { password: values.password });
      setSuccess(response.data.message || 'Password reset successful!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link might be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card" bordered={false}>
        <div className="login-header">
          <Title level={2}>Reset Password</Title>
          <Text type="secondary">Enter your new password below</Text>
        </div>

        {error && <Alert message={error} type="error" showIcon className="login-alert" />}
        {success && <Alert message={success} type="success" showIcon className="login-alert" />}

        <Form
          name="reset_password"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          className="login-form"
        >
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your new Password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="New Password"
            />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-button" loading={loading} block>
              Update Password
            </Button>
          </Form.Item>
          
          <div className="login-footer">
            <Text>Back to <Link to="/login">Login</Link></Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPassword;
