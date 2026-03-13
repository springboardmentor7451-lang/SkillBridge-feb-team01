import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import AuthContext from '../context/AuthContext';
import './Login.css';

const { Title, Paragraph } = Typography;

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (values) => {
        setError(null);
        setIsLoading(true);
        try {
            const userData = await login(values.email, values.password);
            if (userData.role === 'ngo') {
                navigate('/manage-opportunities');
            } else {
                navigate('/profile');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <Card className="login-card">
                <div className="login-header">
                    <div className="login-icon-top">
                        <UserOutlined />
                    </div>
                    <Title level={2}>Welcome Back</Title>
                    <Paragraph type="secondary">Sign in to continue to SkillBridge</Paragraph>
                </div>

                {error && (
                    <Alert
                        message="Login Error"
                        description={error}
                        type="error"
                        showIcon
                        className="auth-alert"
                    />
                )}

                <Form
                    name="login_form"
                    layout="vertical"
                    onFinish={onSubmit}
                    className="login-form-antd"
                    size="large"
                >
                    <Form.Item
                        name="email"
                        label="Email Address"
                        rules={[
                            { required: true, message: 'Please input your Email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="you@example.com" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            placeholder="Enter your password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                            loading={isLoading}
                            block
                        >
                            {isLoading ? 'Signing in...' : 'Sign In →'}
                        </Button>
                    </Form.Item>
                </Form>

                <div className="auth-footer">
                    <Paragraph>
                        Don't have an account? <Link to="/register">Create one</Link>
                    </Paragraph>
                </div>
            </Card>
        </div>
    );
};

export default Login;
