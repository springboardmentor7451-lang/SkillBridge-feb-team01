import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

// Navigation configuration based on role
const navigationConfig = {
    volunteer: [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/opportunities', label: 'Browse Opportunities', icon: '🔍' },
        { path: '/my-applications', label: 'My Applications', icon: '📝' },
        { path: '/profile', label: 'Profile', icon: '👤' }
    ],
    ngo: [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/opportunities/create', label: 'Create Opportunity', icon: '➕' },
        { path: '/opportunities/manage', label: 'My Opportunities', icon: '📋' },
        { path: '/profile', label: 'Profile', icon: '👤' }
    ]
};

const Sidebar = ({ isOpen, onToggle }) => {
    const { role } = useAuth();
    const location = useLocation();

    // Get navigation items based on role
    const navItems = navigationConfig[role] || [];

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <h2 className="sidebar-title">SkillBridge</h2>
            </div>
            
            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                        onClick={() => onToggle && onToggle()}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span className="sidebar-label">{item.label}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
