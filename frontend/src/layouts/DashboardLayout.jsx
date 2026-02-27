import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardNavbar from '../components/DashboardNavbar';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className={`dashboard-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
            <div className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
            </div>
            <div className="dashboard-main">
                <div className="dashboard-navbar">
                    <DashboardNavbar onToggleSidebar={toggleSidebar} />
                </div>
                <main className="dashboard-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
