import React, { useState } from 'react';
import api from '../api';

function BookmarkButton({ postId }) {
    const [bookmarked, setBookmarked] = useState(false);

    const handleBookmark = async () => {
        try {
            const data = { post: postId };  
            const res = await api.post('/api/user/bookmarks/create/', data);
            if (res.status === 201) {
                setBookmarked(true);
                alert('Post bookmarked successfully!');
            }
        } catch (err) {
            console.error('Error bookmarking post:', err);
            if (err.response) {
                console.error('Server response:', err.response.data);
                alert(`Error: ${JSON.stringify(err.response.data)}`);
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

