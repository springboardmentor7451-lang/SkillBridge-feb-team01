import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="logo">
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 20h16v2H4v-2zm2-7h12v2H6v-2zm2-5h8v2H8V8zm3-6h2v4h-2V2z" fill="#6366f1" opacity="0.3" />
                        <path d="M21 15c0-4.63-3.08-8.52-7.27-9.7l.95-3.32-1.9-.56L11 7.21 9.22 1.42 7.32 1.98l.95 3.32C4.08 6.48 1 10.37 1 15v4h2v-4c0-4.42 3.58-8 8-8s8 3.58 8 8v4h2v-4zM11 9c-3.31 0-6 2.69-6 6v2h12v-2c0-3.31-2.69-6-6-6z" fill="#6366f1" />
                    </svg>
                    SkillBridge
                </Link>
            </div>
            <ul className="nav-links">
                {user ? (
                    <>
                        <li><Link to="/profile">👤 Profile</Link></li>
                        <li>
                            <button onClick={handleLogout}>
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/opportunities">Opportunities</Link></li>
                        <li><Link to="/organizations">For NGOs</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/login">Log In</Link></li>
                        <li><Link to="/register" className="nav-btn-primary">Get Started</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
