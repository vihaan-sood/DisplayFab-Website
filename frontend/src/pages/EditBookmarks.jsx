import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';
import { Box, Button, Typography, Grid, Paper , TextField} from '@mui/material';
import api from '../api';
import Post from '../components/Post';
import Header from '../components/Header';

function EditBookmarks() {
    const { user } = useContext(UserContext);  // Get current user
    const [bookmarks, setBookmarks] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (user) {
            getUserBookmarks(user.id);
        }
    }, [user]);

    const getUserBookmarks = async (userId) => {
        try {
            const res = await api.get(`/api/user/bookmarks/${userId}/`);
            const bookmarksData = res.data;
            const postDetailsPromises = bookmarksData.map(bookmark =>
                api.get(`/api/posts/${bookmark.post}/`).then(res => res.data)
            );
            const postsDetails = await Promise.all(postDetailsPromises);
            setBookmarks(bookmarksData.map((bookmark, index) => ({ ...bookmark, post: postsDetails[index] })));
        } catch (err) {
            console.error('Error fetching user bookmarks:', err);
            setError('Failed to load bookmarks.');
        }
    };

    const handleDeleteBookmark = async (bookmarkId) => {
        if (!window.confirm('Are you sure you want to delete this bookmark?')) return;

        try {
            await api.delete(`/api/user/bookmarks/${bookmarkId}/delete/`, { requiresAuth: true });
            // Update the bookmarks state after deletion
            setBookmarks(bookmarks.filter(bookmark => bookmark.id !== bookmarkId));
        } catch (err) {
            console.error('Error deleting bookmark:', err);
            setError('Failed to delete bookmark.');
        }
    };

    const filteredBookmarks = bookmarks.filter((bookmark) =>
        bookmark.post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
        <Header/>
        <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Manage Your Bookmarks
            </Typography>

            {/* Search Input */}
            <TextField
                fullWidth
                label="Search Bookmarked Posts"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ marginBottom: 2 }}
            />

            {error && <Typography color="error">{error}</Typography>}

            {filteredBookmarks.length === 0 ? (
                <Typography>No bookmarks found.</Typography>
            ) : (
                <Grid container spacing={2}>
                    {filteredBookmarks.map((bookmark) => (
                        <Grid item key={bookmark.id} xs={12}>
                            <Paper sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Box sx={{ marginBottom: 2, width: '100%' }}>
                                    <Post post={bookmark.post} />
                                </Box>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleDeleteBookmark(bookmark.id)}
                                    sx={{ alignSelf: 'center' }}
                                >
                                    Delete Bookmark
                                </Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
        </>
    );
}

export default EditBookmarks;
