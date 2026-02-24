import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <h1>
                            SkillBridge: Connect <br />
                            <span className="highlight">Volunteers with NGOs</span>
                        </h1>
                        <p className="hero-subtitle">
                            A platform where skilled volunteers connect with NGOs for short-term or long-term opportunities.
                            Register to post or apply for skill-based impact projects today.
                        </p>
                        <div className="hero-cta">
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Find Opportunities
                            </Link>
                            <Link to="/organizations" className="btn btn-secondary btn-lg">
                                Post a Project
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🔍</div>
                            <h3>Find Opportunities</h3>
                            <p>Browse skill-based volunteering roles that match your expertise.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🤝</div>
                            <h3>Connect with NGOs</h3>
                            <p>Directly collaborate with non-profits for short-term or long-term projects.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📢</div>
                            <h3>Post Requirements</h3>
                            <p>NGOs can easily post their needs and find the right talent quickly.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
