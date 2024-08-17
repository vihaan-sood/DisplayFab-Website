import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiBookmarkPlus } from "react-icons/ci";
import { IconButton } from '@mui/material';
import api from '../api';
import { ACCESS_TOKEN } from '../constants';

function BookmarkButton({ postId }) {
    const [bookmarked, setBookmarked] = useState(false);
    const navigate = useNavigate();

    const handleBookmark = async () => {
        if (!localStorage.getItem(ACCESS_TOKEN)) {
            alert('You need to log in to bookmark posts.');
            navigate('/login');
            return;
        }

        try {
            const data = { post: postId };
            const token = localStorage.getItem(ACCESS_TOKEN);
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            };
            const res = await api.post('/api/user/bookmarks/create/', data, config);
            if (res.status === 201) {
                setBookmarked(true);
                alert('Post bookmarked successfully!');
            } else if (res.status === 400) {
                alert('Bookmark already exists!');
            } else {
                alert('Failed to bookmark the post. Please try again.');
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                alert('You need to log in to bookmark posts.');
                navigate('/login');
            } else {
                console.error('Error bookmarking post:', err);
                if (err.response) {
                    console.error('Server response:', err.response.data);
                    alert(`Error: ${JSON.stringify(err.response.data)}`);
                }
            }
        }
    };

    return (
        <IconButton onClick={handleBookmark} disabled={bookmarked} color="primary">
            <CiBookmarkPlus size={24} />
        </IconButton>
    );
}

export default BookmarkButton;



