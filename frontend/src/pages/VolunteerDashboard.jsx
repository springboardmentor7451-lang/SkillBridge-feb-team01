import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const VolunteerDashboard = () => {
    const { user } = useContext(AuthContext);

    if (!user) return null;

    // Calculate profile completion
    const completionFields = [
        user.name,
        user.email,
        user.location,
        user.bio,
        user.skills && user.skills.length > 0
    ];

    const completion =
        Math.round(
            (completionFields.filter(Boolean).length /
                completionFields.length) * 100
        );

    return (
        <div className="profile-page dashboard-page">
            <div className="profile-card">

                {/* HEADER */}
                <div className="profile-header">
                    <div className="profile-avatar">
                        {user.name?.charAt(0)}
                    </div>
                    <div className="profile-header-info">
                        <h1>Welcome, {user.name} 👋</h1>
                        <div className="role-badge">
                            🙋 Volunteer Dashboard
                        </div>
                    </div>
                </div>

                <div className="profile-body">

                    {/* ===== STATS GRID ===== */}
                    <div className="profile-section">
                        <div className="profile-section-title">
                            Your Impact
                        </div>

                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                            gap: "16px",
                            marginTop: "12px"
                        }}>
                            {/* <div className="profile-field">
                                <div className="profile-field-icon">📌</div>
                                <div className="profile-field-content">
                                    <div className="profile-field-label">
                                        Applications
                                    </div>
                                    <div className="profile-field-value">
                                        0
                                    </div>
                                </div>
                            </div> */}
                            <Link to="/applications" style={{ textDecoration: "none" }}>
                                <div className="profile-field" style={{ cursor: "pointer" }}>
                                    <div className="profile-field-icon">📌</div>
                                    <div className="profile-field-content">
                                        <div className="profile-field-label">
                                            Applications
                                        </div>
                                        <div className="profile-field-value">
                                            0
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <div className="profile-field">
                                <div className="profile-field-icon">⭐</div>
                                <div className="profile-field-content">
                                    <div className="profile-field-label">
                                        Skills
                                    </div>
                                    <div className="profile-field-value">
                                        {user.skills?.length || 0}
                                    </div>
                                </div>
                            </div>

                            <div className="profile-field">
                                <div className="profile-field-icon">🎯</div>
                                <div className="profile-field-content">
                                    <div className="profile-field-label">
                                        Profile Completion
                                    </div>
                                    <div className="profile-field-value">
                                        {completion}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ===== PROFILE COMPLETION BAR ===== */}
                    <div className="profile-section">
                        <div className="profile-section-title">
                            Profile Progress
                        </div>

                        <div style={{
                            height: "10px",
                            background: "var(--gray-200)",
                            borderRadius: "999px",
                            overflow: "hidden",
                            marginTop: "10px"
                        }}>
                            <div style={{
                                width: `${completion}%`,
                                background: "var(--gradient-btn)",
                                height: "100%",
                                transition: "width 0.4s ease"
                            }}></div>
                        </div>
                    </div>

                    {/* ===== RECOMMENDED OPPORTUNITIES ===== */}
                    <div className="profile-section">
                        <div className="profile-section-title">
                            Recommended Opportunities
                        </div>

                        <div style={{
                            marginTop: "12px",
                            padding: "16px",
                            border: "1px solid var(--gray-200)",
                            borderRadius: "var(--radius-md)"
                        }}>
                            <strong>Frontend Developer Needed</strong>
                            <p style={{ marginTop: "6px", color: "var(--gray-600)" }}>
                                NGO looking for React volunteer.
                            </p>
                            <Link to="/opportunities" className="btn" style={{ marginTop: "10px" }}>
                                View All →
                            </Link>
                        </div>
                    </div>

                    {/* ===== QUICK ACTIONS ===== */}
                    <div className="profile-section">
                        <div className="profile-section-title">
                            Quick Actions
                        </div>
                        
                        <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                            <Link to="/opportunities" className="btn">
                                Browse Opportunities
                            </Link>
                            <Link to="/chat" className="btn btn-secondary">
                            Open Chat
                            </Link>
                            <Link to="/edit-profile" className="btn btn-secondary">
                                Edit Profile
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default VolunteerDashboard;