import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockOpportunities } from '../mockData/opportunities';
import './NGODashboard.css';

const NGODashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleCreateOpportunity = () => {
        navigate('/opportunities/create');
    };

    const handleViewOpportunity = (id) => {
        navigate(`/opportunities/${id}`);
    };

    const handleEditOpportunity = (id) => {
        navigate(`/opportunities/${id}/edit`);
    };

    if (loading) {
        return (
            <div className="ngo-dashboard">
                <div className="loading-skeleton">
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="ngo-dashboard">
            <section className="org-info-section">
                <h2>{user?.organizationName}</h2>
                <p className="org-description">{user?.organizationDescription}</p>
            </section>

            <section className="actions-section">
                <button className="btn-create-opportunity" onClick={handleCreateOpportunity}>
                    ➕ Create New Opportunity
                </button>
            </section>

            <section className="opportunities-section">
                <h3>Your Opportunities</h3>
                {mockOpportunities.length === 0 ? (
                    <div className="empty-state">
                        <p className="empty-state-icon">📋</p>
                        <h4>No opportunities yet</h4>
                        <p>Create your first opportunity to start connecting with volunteers.</p>
                        <button className="btn-create-opportunity" onClick={handleCreateOpportunity}>
                            Create Opportunity
                        </button>
                    </div>
                ) : (
                    <div className="opportunities-grid">
                        {mockOpportunities.map((opp) => (
                            <div key={opp.id} className="opportunity-card">
                                <div className="opportunity-header">
                                    <h4>{opp.title}</h4>
                                    <span className={`status-badge ${opp.status.toLowerCase()}`}>
                                        {opp.status}
                                    </span>
                                </div>
                                <div className="opportunity-details">
                                    <div className="detail-item">
                                        <span className="detail-label">Applicants:</span>
                                        <span className="detail-value">{opp.applicants}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Date:</span>
                                        <span className="detail-value">{opp.date}</span>
                                    </div>
                                </div>
                                <div className="opportunity-actions">
                                    <button 
                                        className="btn-view"
                                        onClick={() => handleViewOpportunity(opp.id)}
                                    >
                                        View Details
                                    </button>
                                    <button 
                                        className="btn-edit"
                                        onClick={() => handleEditOpportunity(opp.id)}
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default NGODashboard;
