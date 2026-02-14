import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Applications = () => {
    const { user } = useContext(AuthContext);

    // Mock applications
    // const mockApplications = [
    //     {
    //         id: 1,
    //         title: "Frontend Developer - NGO Health",
    //         status: "Pending"
    //     },
    //     {
    //         id: 2,
    //         title: "UI/UX Designer - Education NGO",
    //         status: "Accepted"
    //     }
    // ];
    const applications = user?.applications || [];

    return (
        <div className="profile-page">
            <div className="profile-card">

                <div className="profile-header">
                    <div className="profile-avatar">
                        📌
                    </div>
                    <div className="profile-header-info">
                        <h1>Your Applications</h1>
                        <div className="role-badge">
                            🙋 Volunteer
                        </div>
                    </div>
                </div>

                <div className="profile-body">

                    {mockApplications.length === 0 ? (
                        <p style={{ color: "var(--gray-500)" }}>
                            You have not applied to any opportunities yet.
                        </p>
                    ) : (
                        mockApplications.map(app => (
                            <div
                                key={app.id}
                                className="profile-field"
                                style={{ marginBottom: "12px" }}
                            >
                                <div className="profile-field-icon">📄</div>
                                <div className="profile-field-content">
                                    <div className="profile-field-label">
                                        Opportunity
                                    </div>
                                    <div className="profile-field-value">
                                        {app.title}
                                    </div>
                                    <div style={{
                                        marginTop: "4px",
                                        fontSize: "0.85rem",
                                        color:
                                            app.status === "Accepted"
                                                ? "var(--success)"
                                                : "var(--warning)"
                                    }}>
                                        Status: {app.status}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                </div>
            </div>
        </div>
    );
};

export default Applications;