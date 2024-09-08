import React, { useState, useEffect , useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { TextField, Button, Box, Typography, Grid, Paper } from '@mui/material';
import { UserContext } from "../UserContext";
import Header from '../components/Header';

function PostMngr({ }) {
    const { user } = useContext(UserContext);
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            getUserPosts(user.id);
        }
    }, [user]);

    const getUserPosts = async (userId) => {
        try {
            const res = await api.get(`api/posts/myposts/`, { requiresAuth: true });
            setPosts(res.data);
        } catch (err) {
            console.error('Error fetching user posts:', err);
        }
    };

    const handleDelete = async (postId) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            await api.delete(`/api/posts/delete/${postId}/`, {
                requiresAuth: true,  
            });
            setPosts(posts.filter(post => post.id !== postId));
            alert('Post has been successfully deleted.');
        } catch (err) {
            setError('Failed to delete post.');
            console.error('Error deleting post:', err.response || err);
        }
    };

    const handleUpdate = (postId) => {
        navigate(`/edit-post/${postId}`); 
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
        <Header/>
        <Box sx={{ maxWidth: 800, margin: 'auto', padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Manage Your Posts
            </Typography>
            <TextField
                label="Search by Title"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ marginBottom: 2 }}
            />
            {error && <Typography color="error" sx={{ marginBottom: 2 }}>{error}</Typography>}
            {loading ? (
                <Typography>Loading...</Typography>
            ) : (
                <Grid container spacing={2}>
                    {filteredPosts.map(post => (
                        <Grid item xs={12} key={post.id}>
                            <Paper elevation={3} sx={{ padding: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    {post.title}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleUpdate(post.id)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ backgroundColor: '#FF0000', color: '#FFFFFF' }}
                                        onClick={() => handleDelete(post.id)}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box> 
        </>
    );
}

export default PostMngr;