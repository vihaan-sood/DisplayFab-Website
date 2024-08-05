import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Avatar from '@mui/material/Avatar';
import { UserContext } from "../UserContext";
import api from "../api";
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

function MyProfile() {
    const { user, updateUser } = useContext(UserContext);
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        if (user) {
            getUserDetails(user.id);
        }
    }, [user]);

    const getUserDetails = async (userId) => {
        try {
            const res = await api.get(`/api/user/myprofile/${userId}/`);
            setUserDetails(res.data);
        } catch (err) {
            console.error('Error fetching user details:', err);
        }
    };

    if (!userDetails) {
        return <h2>Loading...</h2>;
    }

    return (
        <>
            <Header />
            <h1>My Profile</h1>
            <Avatar alt={userDetails.username} src="" />
            <div>
                <h2>{userDetails.first_name} {userDetails.last_name}</h2>
                <p>{userDetails.email}</p>
                <h3>About Me</h3>
                <ReactMarkdown remarkPlugins={[gfm]}>{userDetails.about_me}</ReactMarkdown>
            </div>
        </>
    );
}

export default MyProfile;
