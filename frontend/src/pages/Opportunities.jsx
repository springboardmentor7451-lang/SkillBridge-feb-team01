import { Link } from 'react-router-dom';

const Opportunities = () => {
    return (
        <div className="landing-page">
            <section className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <h1>
                            Find Your Next <br />
                            <span className="highlight">Volunteering Opportunity</span>
                        </h1>
                        <p className="hero-subtitle">
                            Browse through hundreds of impactful projects. Filter by skills, location, and cause.
                            Make a difference where it matters most.
                        </p>
                        <div className="hero-cta">
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Browse Opportunities
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Opportunities;
