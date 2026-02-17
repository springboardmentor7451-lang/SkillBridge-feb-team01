import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="landing-page">
            <section className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <h1>
                            About <br />
                            <span className="highlight">SkillBridge</span>
                        </h1>
                        <p className="hero-subtitle">
                            We are a platform dedicated to connecting skilled volunteers with non-profit organizations.
                            Our mission is to amplify social impact through technology and collaboration.
                        </p>
                        <div className="hero-cta">
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Join Our Community
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
