import { useAuth } from '../context/AuthContext';
import VolunteerDashboard from '../pages/VolunteerDashboard';
import NGODashboard from '../pages/NGODashboard';

const DashboardContent = () => {
    const { role } = useAuth();

    // Single conditional rendering point based on role
    if (role === 'volunteer') {
        return <VolunteerDashboard />;
    }

    if (role === 'ngo') {
        return <NGODashboard />;
    }

    // Fallback for invalid role
    return (
        <div>
            <h2>Invalid Role</h2>
            <p>Unable to determine dashboard type. Please contact support.</p>
        </div>
    );
};

export default DashboardContent;
