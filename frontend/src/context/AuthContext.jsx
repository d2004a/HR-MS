import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                const decoded = jwtDecode(parsedUser.token);
                
                // Check if token expired
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser(parsedUser);
                }
            } catch (error) {
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);
        }
        return response.data;
    };

    const register = async (fullName, email, password) => {
        const response = await api.post('/auth/register', { fullName, email, password });
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);
        }
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
