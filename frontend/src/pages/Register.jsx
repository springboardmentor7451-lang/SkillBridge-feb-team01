import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'volunteer',
        skills: '',
        location: '',
        bio: '',
        organization_name: '',
        organization_description: '',
        website_url: ''
    });

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { name, email, password, role, skills, location, bio, organization_name, organization_description, website_url } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const dataToSubmit = { ...formData };
            if (dataToSubmit.skills) {
                if (typeof dataToSubmit.skills === 'string') {
                    dataToSubmit.skills = dataToSubmit.skills.split(',').map(s => s.trim());
                }
            }
            await register(dataToSubmit);
            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-form">
                <h2>Create Account</h2>
                <p className="auth-subtitle">Join SkillBridge and make a difference</p>

                {error && (
                    <div className="alert alert-error">
                        <span>⚠️</span>
                        {error}
                    </div>
                )}

                {/* Role Toggle */}
                <div className="role-toggle">
                    <button
                        type="button"
                        className={`role-toggle-btn ${role === 'volunteer' ? 'active' : ''}`}
                        onClick={() => setFormData({ ...formData, role: 'volunteer' })}
                    >
                        🙋 Volunteer
                    </button>
                    <button
                        type="button"
                        className={`role-toggle-btn ${role === 'ngo' ? 'active' : ''}`}
                        onClick={() => setFormData({ ...formData, role: 'ngo' })}
                    >
                        🏢 NGO / Organization
                    </button>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={onChange}
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="reg-email">Email Address</label>
                        <input
                            type="email"
                            id="reg-email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="reg-password">Password</label>
                        <input
                            type="password"
                            id="reg-password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            placeholder="Create a strong password"
                            required
                        />
                    </div>

                    <div className="form-divider">Personal Details</div>

                    <div className="form-group">
                        <label htmlFor="location">Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={location}
                            onChange={onChange}
                            placeholder="City, Country"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="bio">Bio</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={bio}
                            onChange={onChange}
                            placeholder="Tell us about yourself..."
                        ></textarea>
                    </div>

                    {role === 'volunteer' && (
                        <div className="form-group">
                            <label htmlFor="skills">Skills</label>
                            <input
                                type="text"
                                id="skills"
                                name="skills"
                                value={skills}
                                onChange={onChange}
                                placeholder="e.g. Teaching, Coding, First Aid"
                            />
                        </div>
                    )}

                    {role === 'ngo' && (
                        <>
                            <div className="form-divider">Organization Info</div>
                            <div className="form-group">
                                <label htmlFor="org-name">Organization Name</label>
                                <input
                                    type="text"
                                    id="org-name"
                                    name="organization_name"
                                    value={organization_name}
                                    onChange={onChange}
                                    placeholder="Your Organization"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="org-desc">Organization Description</label>
                                <textarea
                                    id="org-desc"
                                    name="organization_description"
                                    value={organization_description}
                                    onChange={onChange}
                                    placeholder="What does your organization do?"
                                    required
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="website">Website URL</label>
                                <input
                                    type="text"
                                    id="website"
                                    name="website_url"
                                    value={website_url}
                                    onChange={onChange}
                                    placeholder="https://example.org"
                                    required
                                />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className="btn"
                        style={{ width: '100%', marginTop: '8px' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account →'}
                    </button>
                </form>

                <p className="auth-link">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
