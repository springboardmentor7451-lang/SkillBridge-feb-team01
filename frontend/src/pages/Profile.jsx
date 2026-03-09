import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Profile = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p style={{ color: 'var(--gray-500)', fontWeight: 500 }}>Loading profile...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="loading-container">
                <p style={{ color: 'var(--gray-500)', fontSize: '1.1rem' }}>Please login to view your profile</p>
            </div>
        );
    }

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="profile-page">
            <div className="profile-card">
                {/* Header with avatar */}
                <div className="profile-header">
                    <div className="profile-avatar">
                        {getInitials(user.name)}
                    </div>
                    <div className="profile-header-info">
                        <h1>{user.name}</h1>
                        <div className="role-badge">
                            {user.role === 'volunteer' ? '🙋' : '🏢'} {user.role}
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="profile-body">
                    {/* Contact Section */}
                    <div className="profile-section">
                        <div className="profile-section-title">Contact Information</div>

                        <div className="profile-field">
                            <div className="profile-field-icon">📧</div>
                            <div className="profile-field-content">
                                <div className="profile-field-label">Email</div>
                                <div className="profile-field-value">{user.email}</div>
                            </div>
                        </div>

                        <div className="profile-field">
                            <div className="profile-field-icon">📍</div>
                            <div className="profile-field-content">
                                <div className="profile-field-label">Location</div>
                                <div className="profile-field-value">{user.location || 'Not specified'}</div>
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="profile-section">
                        <div className="profile-section-title">About</div>

                        <div className="profile-field">
                            <div className="profile-field-icon">📝</div>
                            <div className="profile-field-content">
                                <div className="profile-field-label">Bio</div>
                                <div className="profile-field-value">{user.bio || 'No bio provided'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Volunteer Skills */}
                    {user.role === 'volunteer' && (
                        <div className="profile-section">
                            <div className="profile-section-title">Skills & Expertise</div>
                            <div style={{ paddingTop: '8px' }}>
                                {user.skills && user.skills.length > 0
                                    ? user.skills.map((skill, index) => (
                                        <span key={index} className="skill-tag">
                                            {skill}
                                        </span>
                                    ))
                                    : <span style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>No skills added yet</span>
                                }
                            </div>
                        </div>
                    )}

                    {/* NGO Info */}
                    {user.role === 'ngo' && (
                        <div className="profile-section">
                            <div className="profile-section-title">Organization Details</div>

                            <div className="profile-field">
                                <div className="profile-field-icon">🏢</div>
                                <div className="profile-field-content">
                                    <div className="profile-field-label">Organization Name</div>
                                    <div className="profile-field-value">{user.organization_name}</div>
                                </div>
                            </div>

                            <div className="profile-field">
                                <div className="profile-field-icon">📋</div>
                                <div className="profile-field-content">
                                    <div className="profile-field-label">Description</div>
                                    <div className="profile-field-value">{user.organization_description}</div>
                                </div>
                            </div>

                            <div className="profile-field">
                                <div className="profile-field-icon">🌐</div>
                                <div className="profile-field-content">
                                    <div className="profile-field-label">Website</div>
                                    <div className="profile-field-value">
                                        <a
                                            href={user.website_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: 'var(--primary-600)', fontWeight: 600 }}
                                        >
                                            {user.website_url} ↗
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
