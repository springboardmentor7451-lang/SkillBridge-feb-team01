import { createContext, useState, useEffect } from 'react';
import api from '../services/api';   // ✅ use centralized axios

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    // 🔁 whenever token changes → fetch user
    useEffect(() => {
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    // 👤 get logged-in user
    const fetchUser = async () => {
        try {
            const res = await api.get('/users/profile');
            setUser(res.data);
        } catch (error) {
            console.error('Error fetching user', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    // 🔐 login
    const login = async (email, password) => {
        const res = await api.post('/auth/login', {
            email,
            password,
        });

        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data);

        return res.data;
    };

    // 📝 register
    const register = async (userData) => {
        const res = await api.post('/auth/register', userData);

        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data);

        return res.data;
    };

    // 🚪 logout
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;