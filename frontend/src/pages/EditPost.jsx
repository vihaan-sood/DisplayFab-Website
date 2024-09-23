import React, { useState, useEffect } from "react";
import React, { useState, useEffect } from "react";
import PostEditForm from "../components/PostEditForm";
import Header from "../components/Header";
import api from "../api"; 

const EditPostPage = () => {
    const [user, setUser] = useState('');
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/api/user/currentuser/', { requiresAuth: true });
                setUser(response.data || ''); 
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError('Failed to load current user data.');
            }
        };

        fetchUser(); 
    }, []); 

    return (
        <>
            <Header />
            {error ? (
                <p>{error}</p>
            ) : (
                <>
                    <PostEditForm />
                </>
            )}
        </>
    );
};

export default EditPostPage;
