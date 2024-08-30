import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 
import { TextField, Button, Box, Typography } from '@mui/material';

function EditAboutMe() {
    const [aboutMe, setAboutMe] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAboutMe = async () => {
            try {
                const response = await api.get('/api/user/currentuser/' , { requiresAuth: true });
                setAboutMe(response.data.about_me || '');
            } catch (err) {
                setError('Failed to load current About Me content.');
            }
        };
        fetchAboutMe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put('/api/user/update-about-me/', { about_me: aboutMe } ,  { requiresAuth: true });
            navigate('/myprofile'); 
        } catch (err) {
            setError('Failed to update About Me.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Edit About Me
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="About Me"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                    sx={{ marginBottom: 2 }}
                />
                {error && <Typography color="error" sx={{ marginBottom: 2 }}>{error}</Typography>}
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                </Button>
            </form>
        </Box>
    );
}

export default EditAboutMe;
