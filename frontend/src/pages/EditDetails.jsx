import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import {
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Box,
    Typography,
    Chip,
    Paper,
    Avatar,
    Modal,
    Slider
} from '@mui/material';
import Header from '../components/Header';
import Cropper from 'react-easy-crop';  // For image cropping
import { getCroppedImg } from '../utils/getCroppedImg';
import { ACCESS_TOKEN } from '../constants';

function EditDetails() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        selectedKeywords: []
    });
    const [user, setUser] = useState(null);  // To store user data
    const [keywords, setKeywords] = useState([]);
    const [newKeyword, setNewKeyword] = useState('');
    const [keywordSearch, setKeywordSearch] = useState('');
    const [image, setImage] = useState(null);
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [croppingImage, setCroppingImage] = useState(null);
    const navigate = useNavigate();

    // Fetch current user data when the component is mounted
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const res = await api.get('/api/user/currentuser/', { requiresAuth: true });
                const userData = res.data;

                // Set user details and pre-select user's current keywords
                setUser(userData);
                setFormData({
                    first_name: userData.first_name || '',
                    last_name: userData.last_name || '',
                    email: userData.email || '',
                    selectedKeywords: userData.user_keywords ? userData.user_keywords.map((kw) => kw.key_id) : []  // Pre-select keywords
                });
            } catch (err) {
                console.error('Error fetching user details:', err);
            }
        };

        fetchUserDetails();
        fetchKeywords(); // Fetch all available keywords
    }, []);

    // Fetch all available keywords
    const fetchKeywords = async (searchTerm = '') => {
        try {
            const res = await api.get(`/api/keywords/?search=${searchTerm}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                requiresAuth: true,
            });
            setKeywords(res.data);
        } catch (err) {
            console.error('Error fetching keywords:', err);
        }
    };

    const handleKeywordChange = (e) => {
        setFormData({
            ...formData,
            selectedKeywords: e.target.value  // Ensure the selected keywords are updated correctly
        });
    };

    const handleKeywordSearch = (e) => {
        setKeywordSearch(e.target.value);
        fetchKeywords(e.target.value);
    };

    const addKeyword = async (keyword) => {
        try {
            const res = await api.post('/api/keywords/create/', { word: keyword }, { requiresAuth: true });
            if (res.status === 201) {
                setNewKeyword('');
                fetchKeywords();
                alert('Keyword Added');
            } else {
                console.error('Keyword creation returned unexpected status:', res.status);
            }
        } catch (err) {
            console.error('Error adding keyword:', err);
            if (err.response) {
                console.error('Server response:', err.response.data);
                alert('Error adding keyword - it may already exist.');
            }
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setCroppingImage(reader.result); // Set image data to be cropped
                setIsCropModalOpen(true); // Open cropper modal
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropSave = async () => {
        try {
            const croppedImageBlob = await getCroppedImg(croppingImage, croppedAreaPixels);

            const fileName = `cropped_image_${user.id}.png`;
            const croppedImageFile = new File([croppedImageBlob], fileName, { type: 'image/png' });

            setImage(croppedImageFile);
            setIsCropModalOpen(false);

        } catch (err) {
            console.error('Error cropping image:', err);
            alert('Failed to crop image.');
        }
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem(ACCESS_TOKEN);
            if (!token) {
                throw new Error('Token not found. Please login again.');
            }

            // Construct form data (with multipart for image)
            const updatedFormData = new FormData();

            updatedFormData.append('first_name', formData.first_name);
            updatedFormData.append('last_name', formData.last_name);
            updatedFormData.append('email', formData.email);
            updatedFormData.append('username', user.username); // Ensure username is included

            // Append selected keywords (user_keywords)
            formData.selectedKeywords.forEach((keywordId) => {
                updatedFormData.append('user_keywords', keywordId);  // Send keyword ID as a primary key (integer)
            });

            if (image) {
                updatedFormData.append("image", image);  // Appending the image file
            }

            const response = await api.put('/api/user/update-details/', updatedFormData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                requiresAuth: true
            });

            if (response.status === 200) {
                alert('Profile updated successfully');
                navigate('/myprofile');
            } else {
                console.error('Update failed:', response.data);
                alert('Update failed');
            }
        } catch (err) {
            console.error('Error updating profile:', err.response ? err.response.data : err.message);
        }
    };

    return (
        <>
            <Header />
            <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
                <Paper elevation={3} sx={{ padding: 4 }}>
                    <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                        Edit Your Details
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        {/* Conditional rendering of Avatar to handle null/undefined user or image */}
                        <Avatar
                            src={image ? URL.createObjectURL(image) : (user && user.image ? `${user.image}?t=${new Date().getTime()}` : '')}
                            sx={{ width: 100, height: 100 }}
                        />
                    </Box>
                    <Button variant="outlined" component="label" fullWidth sx={{ mb: 3 }}>
                        Change Image
                        <input type="file" hidden onChange={handleImageUpload} />
                    </Button>

                    <form onSubmit={handleSubmit}>
                        {/* Pre-fill first name */}
                        <TextField
                            fullWidth
                            label="First Name"
                            value={formData.first_name}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                            sx={{ mb: 3 }}
                        />
                        {/* Pre-fill last name */}
                        <TextField
                            fullWidth
                            label="Last Name"
                            value={formData.last_name}
                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                            sx={{ mb: 3 }}
                        />

                        {/* Keyword Search and Selection */}
                        <TextField
                            label="Filter Keywords"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            value={keywordSearch}
                            onChange={handleKeywordSearch}
                        />
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="keyword-select-label">Select Keywords</InputLabel>
                            <Select
                                labelId="keyword-select-label"
                                multiple
                                value={formData.selectedKeywords}
                                onChange={handleKeywordChange}
                                renderValue={(selected) =>
                                    selected
                                        .map((id) => {
                                            const keyword = keywords.find((k) => k.key_id === id);
                                            return keyword ? keyword.word : '';
                                        })
                                        .join(', ')
                                }
                            >
                                {keywords.map((keyword) => (
                                    <MenuItem key={keyword.key_id} value={keyword.key_id}>
                                        {keyword.word}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Display Selected Keywords as Chips */}
                        {formData.selectedKeywords.length > 0 && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Selected Keywords:
                                </Typography>
                                {formData.selectedKeywords.map((keywordId) => {
                                    const keyword = keywords.find((k) => k.key_id === keywordId);
                                    return keyword ? (
                                        <Chip key={keyword.key_id} label={keyword.word} sx={{ margin: 0.5 }} />
                                    ) : null;
                                })}
                            </Box>
                        )}

                        {/* Add New Keyword */}
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                const keyword = window.prompt('Enter a new keyword:');
                                if (keyword) {
                                    addKeyword(keyword);
                                }
                            }}
                            sx={{ mb: 2 }}
                        >
                            Add New Tag
                        </Button>

                        {/* Submit button */}
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            Save Changes
                        </Button>
                    </form>
                </Paper>
            </Box>

            {/* Cropper Modal */}
            <Modal open={isCropModalOpen} onClose={() => setIsCropModalOpen(false)}>
                <Box
                    sx={{
                        width: '80%',
                        height: '80%',
                        margin: 'auto',
                        mt: 5,
                        p: 2,
                        backgroundColor: '#fff',
                        boxShadow: 24,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative',
                    }}
                >
                    {croppingImage && (
                        <Cropper
                            image={croppingImage}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    )}
                    <Slider
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        onChange={(e, zoom) => setZoom(zoom)}
                        sx={{ mt: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2, alignSelf: 'flex-end' }}
                        onClick={handleCropSave}
                    >
                        Save Cropped Image
                    </Button>
                </Box>
            </Modal>
        </>
    );
}

export default EditDetails;



