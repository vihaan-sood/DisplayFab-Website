import React, { createContext, useState, useEffect } from 'react';
import api from './api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const res = await api.get('/api/user/currentuser/');
                setUser(res.data);
            } catch (err) {
                console.error('Error fetching user details:', err);
            }
        };

        fetchUserDetails();
    }, []);


    const updateUser = async () => {
        try {
            const res = await api.get('/api/user/currentuser/');
            setUser(res.data);
        } catch (err) {
            console.error('Error updating user details:', err);
        }
    };

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
};