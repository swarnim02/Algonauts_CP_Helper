import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await authAPI.getMe();
                setUser(response.data);
            } catch (err) {
                setUser(null);
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);
            const response = await authAPI.login({ email, password });
            setUser(response.data);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            setError(message);
            return { success: false, error: message };
        }
    };

    const register = async (name, email, password, role, codeforcesHandle) => {
        try {
            setError(null);
            const response = await authAPI.register({ name, email, password, role, codeforcesHandle });
            setUser(response.data);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed';
            setError(message);
            return { success: false, error: message };
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
            setUser(null);
            setError(null);
            localStorage.removeItem('token');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isMentor: user?.role === 'mentor',
        isStudent: user?.role === 'student'
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
