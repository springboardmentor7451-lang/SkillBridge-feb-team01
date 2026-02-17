import { Link } from 'react-router-dom';

const Organizations = () => {
    return (
        <div className="landing-page">
            <section className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <h1>
                            Empower Your <br />
                            <span className="highlight">Non-Profit Mission</span>
                        </h1>
                        <p className="hero-subtitle">
                            Find skilled volunteers passionate about your cause.
                            Post opportunities, manage applications, and make a bigger impact together.
                        </p>
                        <div className="hero-cta">
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Register Your NGO
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Organizations;
