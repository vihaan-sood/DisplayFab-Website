import React, { createContext, useState, useEffect } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const res = await api.get('/api/user/currentuser/', { requiresAuth: true });
                setUser(res.data);
            } catch (err) {
                console.error('Error fetching user details:', err);
                if (err.response && err.response.status === 401) {
                    navigate('/login');
                }
            }
        };

        fetchUserDetails();
    }, [navigate]);

    const updateUser = async () => {
        try {
            const res = await api.get('/api/user/currentuser/', { requiresAuth: true });
            setUser(res.data);
        } catch (err) {
            console.error('Error updating user details:', err);
        }
    };

    return (
        <UserContext.Provider value={{user, updateUser}}>
            {children}
        </UserContext.Provider>
    );
};
