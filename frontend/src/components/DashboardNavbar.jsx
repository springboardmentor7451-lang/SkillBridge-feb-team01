import { useAuth } from '../context/AuthContext';
import './DashboardNavbar.css';

const DashboardNavbar = ({ onToggleSidebar }) => {
    const { user, role, logout } = useAuth();

    const displayName = role === 'ngo' ? user?.organizationName : user?.name;

    return (
        <nav className="dashboard-navbar-content">
            <div className="navbar-left">
                <button 
                    className="sidebar-toggle-btn" 
                    onClick={onToggleSidebar}
                    aria-label="Toggle navigation menu"
                >
                    ☰
                </button>
            </div>
            
            <div className="navbar-center">
                <h1 className="navbar-title">{displayName}</h1>
            </div>
            
            <div className="navbar-right">
                <div className="user-info">
                    <span className="user-role-badge">{role?.toUpperCase()}</span>
                    <span className="user-email">{user?.email}</span>
                </div>
                <button 
                    className="logout-btn" 
                    onClick={logout}
                    aria-label="Logout"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default DashboardNavbar;
