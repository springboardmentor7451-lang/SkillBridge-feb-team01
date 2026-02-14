import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:5000/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
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

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
        {/*<AuthContext.Provider value={{ user, setUser, token, login, register, logout, loading }}> */}
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
