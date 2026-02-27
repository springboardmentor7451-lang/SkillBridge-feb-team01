import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './VolunteerDashboard.css';

const VolunteerDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    if (loading) {
        return (
            <div className="volunteer-dashboard">
                <div className="loading-skeleton">
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="volunteer-dashboard">
            <section className="welcome-section">
                <h2>Welcome back, {user?.name}! 👋</h2>
                <p>Ready to make a difference today?</p>
            </section>

            <div className="dashboard-grid">
                <section className="profile-card card">
                    <h3>Your Profile</h3>
                    <div className="profile-info">
                        <div className="info-row">
                            <span className="info-label">Name:</span>
                            <span className="info-value">{user?.name}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Email:</span>
                            <span className="info-value">{user?.email}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Location:</span>
                            <span className="info-value">{user?.location || 'Not specified'}</span>
                        </div>
                    </div>
                </section>

                <section className="skills-section card">
                    <h3>Your Skills</h3>
                    {user?.skills && user.skills.length > 0 ? (
                        <div className="skills-list">
                            {user.skills.map((skill, index) => (
                                <span key={index} className="skill-badge">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state-small">
                            <p>No skills added yet.</p>
                            <p className="empty-state-hint">Add skills to improve opportunity matching!</p>
                        </div>
                    )}
                </section>

                <section className="stats-section card">
                    <h3>Quick Stats</h3>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <div className="stat-value">0</div>
                            <div className="stat-label">Hours Volunteered</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">0</div>
                            <div className="stat-label">Opportunities Applied</div>
                        </div>
                    </div>
                    <p className="stats-hint">Start volunteering to see your impact grow!</p>
                </section>
            </div>
        </div>
    );
};

export default VolunteerDashboard;
