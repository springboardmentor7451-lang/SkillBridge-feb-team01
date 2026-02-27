import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Radio, Typography, Alert, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, EnvironmentOutlined } from '@ant-design/icons';
import AuthContext from '../context/AuthContext';
import './Register.css'; // assuming custom styles might be needed later, though mostly antd

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const Register = () => {
    const [role, setRole] = useState('volunteer');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Ant Design Form instance
    const [form] = Form.useForm();

    const handleRoleChange = (e) => {
        setRole(e.target.value);
        // Clear NGO specific fields if switching to volunteer
        if (e.target.value === 'volunteer') {
            form.setFieldsValue({
                organization_name: undefined,
                organization_description: undefined,
                website_url: undefined
            });
        }
    };

    const onSubmit = async (values) => {
        setError(null);
        setIsLoading(true);
        try {
            const dataToSubmit = { ...values, role };

            // Process skills if provided as string
            if (dataToSubmit.skills && typeof dataToSubmit.skills === 'string') {
                dataToSubmit.skills = dataToSubmit.skills.split(',').map(s => s.trim());
            }

            await register(dataToSubmit);
            if (role === 'ngo') {
                navigate('/manage-opportunities');
            } else {
                navigate('/opportunities');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            <Card className="register-card">
                <div className="register-header">
                    <Title level={2}>Create Account</Title>
                    <Paragraph type="secondary">Join SkillBridge and make a difference</Paragraph>
                </div>

                {error && (
                    <Alert
                        message="Registration Error"
                        description={error}
                        type="error"
                        showIcon
                        className="auth-alert"
                    />
                )}

                <div className="role-selector">
                    <Radio.Group
                        value={role}
                        onChange={handleRoleChange}
                        buttonStyle="solid"
                        size="large"
                        className="role-radio-group"
                    >
                        <Radio.Button value="volunteer">🙋 Volunteer</Radio.Button>
                        <Radio.Button value="ngo">🏢 NGO / Organization</Radio.Button>
                    </Radio.Group>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onSubmit}
                    initialValues={{ role: 'volunteer' }}
                    className="register-form-antd"
                >
                    <Form.Item
                        name="name"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please enter your full name!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="John Doe" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email Address"
                        rules={[
                            { required: true, message: 'Please enter your email!' },
                            { type: 'email', message: 'Please enter a valid email address!' }
                        ]}
                    >
                        <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="you@example.com" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            { required: true, message: 'Please enter your password!' },
                            { min: 6, message: 'Password must be at least 6 characters long!' }
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Create a strong password" size="large" />
                    </Form.Item>

                    <Divider plain>Personal Details</Divider>

                    <Form.Item
                        name="location"
                        label="Location"
                    >
                        <Input prefix={<EnvironmentOutlined className="site-form-item-icon" />} placeholder="City, Country" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="bio"
                        label="Bio"
                    >
                        <TextArea placeholder="Tell us about yourself..." autoSize={{ minRows: 2, maxRows: 6 }} size="large" />
                    </Form.Item>

                    {role === 'volunteer' && (
                        <Form.Item
                            name="skills"
                            label="Skills"
                            tooltip="Enter comma separated values"
                        >
                            <Input placeholder="e.g. Teaching, Coding, First Aid" size="large" />
                        </Form.Item>
                    )}

                    {role === 'ngo' && (
                        <>
                            <Divider plain>Organization Info</Divider>

                            <Form.Item
                                name="organization_name"
                                label="Organization Name"
                                rules={[{ required: true, message: 'Please enter the organization name!' }]}
                            >
                                <Input placeholder="Your Organization Name" size="large" />
                            </Form.Item>

                            <Form.Item
                                name="organization_description"
                                label="Organization Description"
                                rules={[{ required: true, message: 'Please describe your organization!' }]}
                            >
                                <TextArea placeholder="What does your organization do?" autoSize={{ minRows: 3, maxRows: 6 }} size="large" />
                            </Form.Item>

                            <Form.Item
                                name="website_url"
                                label="Website URL"
                                rules={[{ required: true, message: 'Please enter the website URL!' }]}
                            >
                                <Input placeholder="https://example.org" size="large" />
                            </Form.Item>
                        </>
                    )}

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="register-form-button"
                            size="large"
                            loading={isLoading}
                            block
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account →'}
                        </Button>
                    </Form.Item>
                </Form>

                <div className="auth-footer">
                    <Paragraph>
                        Already have an account? <Link to="/login">Sign in</Link>
                    </Paragraph>
                </div>
            </Card>
        </div>
    );
};

export default Register;
