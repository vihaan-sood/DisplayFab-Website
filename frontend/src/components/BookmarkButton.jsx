import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function BookmarkButton({ postId }) {
    const [bookmarked, setBookmarked] = useState(false);
    const navigate = useNavigate();

    const handleBookmark = async () => {
        try {
            const data = { post: postId };
            const res = await api.post('/api/user/bookmarks/create/', data, { requiresAuth: true });
            if (res.status === 201) {
                setBookmarked(true);
                alert('Post bookmarked successfully!');
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                alert('You need to log in to bookmark posts.');
                navigate('/login');
            } else if (err.response && err.response.status === 500) {
                alert('Bookmark already exists!');
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
        <button onClick={handleBookmark} disabled={bookmarked}>
            {bookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>
    );
}

export default BookmarkButton;


