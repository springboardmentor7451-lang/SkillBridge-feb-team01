import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:5000/api';

// Mock user data for development
const mockNGOUser = {
    id: 'ngo-001',
    name: 'Green Earth Foundation',
    email: 'contact@greenearth.org',
    role: 'ngo',
    organizationName: 'Green Earth Foundation',
    organizationDescription: 'Environmental conservation and education'
};

const mockVolunteerUser = {
    id: 'vol-001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'volunteer',
    location: 'San Francisco, CA',
    skills: ['Teaching', 'Environmental Conservation', 'Community Outreach']
};


const USE_MOCK_AUTH = true;
const MOCK_ROLE = 'ngo';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (USE_MOCK_AUTH) {
            // Use mock authentication for development
            const mockUser = MOCK_ROLE === 'ngo' ? mockNGOUser : mockVolunteerUser;
            setUser(mockUser);
            setLoading(false);
        } else if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        } else {
            delete axios.defaults.headers.common['Authorization'];
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const res = await axios.get(`${API_BASE}/users/me`);
            setUser(res.data);
        } catch (error) {
            console.error('Error fetching user', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await axios.post(`${API_BASE}/auth/login`, {
            email,
            password,
        });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data);
        return res.data;
    };

    const register = async (userData) => {
        const res = await axios.post(`${API_BASE}/auth/register`, userData);
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    // Compute isAuthenticated and role
    const isAuthenticated = user !== null && user.role !== undefined;
    const role = user?.role || null;

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            register,
            logout,
            loading,
            isAuthenticated,
            role
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for easy context consumption
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
