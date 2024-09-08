import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import {
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Box,
    Typography,
    Modal,
    Checkbox,
    FormControlLabel,
    Chip,
    Slider,
} from "@mui/material";

import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/getCroppedImg";

function PostEditForm() {
    const { id } = useParams(); // Extracting the post ID from the URL
    const [title, setTitle] = useState("");
    const [subheading, setSubheading] = useState("");
    const [content, setContent] = useState("");
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [linkToPaper, setLinkToPaper] = useState("");
    const [authors, setAuthors] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [image, setImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newKeyword, setNewKeyword] = useState("");
    const [keywordSearch, setKeywordSearch] = useState("");
    const [authorSearch, setAuthorSearch] = useState("");
    const [myWork, setMyWork] = useState(false);
    const [imageName, setImageName] = useState("");
    const navigate = useNavigate();

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    const [croppingImage, setCroppingImage] = useState(null);

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        fetchKeywords();
        fetchAuthors();
        fetchPostData();
        fetchCurrentUser();  // Fetch the post data when component loads
    }, []);


    const fetchCurrentUser = async () => {
    try {
        const response = await api.get('/api/user/currentuser/', { requiresAuth: true });
        setCurrentUser(response.data);  // Store the user data
    } catch (err) {
        console.error('Failed to load current user', err);
    }
};

    // Fetch post data to pre-fill the form fields
    const fetchPostData = async () => {
        try {
            const res = await api.get(`/api/posts/${id}/`, {
                headers: {
                    "Content-Type": "application/json",
                },
                requiresAuth: true,
            });
            const postData = res.data;
            setTitle(postData.title);
            setSubheading(postData.subheading);
            setContent(postData.content.content); 
            setSelectedKeywords(postData.keywords.map(keyword => keyword.key_id));
            setSelectedAuthors(postData.authors.map(author => author.id));
            setLinkToPaper(postData.link_to_paper);
            setMyWork(postData.my_work);
            if (postData.image) {
                setImageName(postData.image);
            }
        } catch (err) {
            console.error("Error fetching post data:", err);
        }
    };

    const fetchKeywords = async (searchTerm = "") => {
        try {
            const res = await api.get(`/api/keywords/?search=${searchTerm}`, {
                headers: {
                    "Content-Type": "application/json",
                },
                requiresAuth: true,
            });
            setKeywords(res.data);
        } catch (err) {
            console.error("Error fetching keywords:", err);
        }
    };

    const fetchAuthors = async (searchTerm = "") => {
        try {
            const res = await api.get(`/api/authors/?search=${searchTerm}`, {
                headers: {
                    "Content-Type": "application/json",
                },
                requiresAuth: true,
            });
            setAuthors(res.data);
        } catch (err) {
            console.error("Error fetching authors:", err);
        }
    };

    const handleKeywordChange = (e) => {
        setSelectedKeywords(e.target.value);
    };

    const handleAuthorChange = (e) => {
        const selected = e.target.value;
        setSelectedAuthors(selected);
    };

    const updatePost = async (e) => {
        e.preventDefault();

        try {
            const markdownRes = await api.put(`/api/markdowntext/${id}/edit/`, { content }, { requiresAuth: true });
            const markdownTextId = markdownRes.data.id;

            const formData = new FormData();
            formData.append("title", title);
            formData.append("subheading", subheading);
            formData.append("content", markdownTextId);
            selectedKeywords.forEach(keyword => formData.append("keywords", keyword));
            selectedAuthors.forEach(author => formData.append("authors", author));
            formData.append("link_to_paper", linkToPaper);

            if (image) {
                formData.append("image", image, imageName);
            }

            const postRes = await api.put(`/api/posts/${id}/edit/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                requiresAuth: true,
            });

            if (postRes.status === 200) {
                alert("Post Updated");
                navigate(`/post/${id}`); // Navigate to post view page
            } else {
                alert("Post Update Was Not Successful");
            }
        } catch (err) {
            console.error("Error updating post:", err);
            if (err.response && err.response.data) {
                alert(`Error: ${JSON.stringify(err.response.data)}`);
            }
        }
    };


    const addKeyword = async (keyword) => {
        try {
            const res = await api.post("/api/keywords/create/", { word: keyword }, { requiresAuth: true });
            if (res.status === 201) {
                setNewKeyword("");
                fetchKeywords();
                alert("Keyword Added");
            } else {
                console.error("Keyword creation returned unexpected status:", res.status);
            }
        } catch (err) {
            console.error("Error adding keyword:", err);
            if (err.response) {
                console.error("Server response:", err.response.data);
                alert(`Error: ${JSON.stringify(err.response.data)}`);
            }
        }
    };

    const handleKeywordSearch = (e) => {
        setKeywordSearch(e.target.value);
        fetchKeywords(e.target.value);
    };

    const handleAuthorSearch = (e) => {
        setAuthorSearch(e.target.value);
        fetchAuthors(e.target.value);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setCroppingImage(reader.result);
                setIsCropModalOpen(true);
            };
            reader.readAsDataURL(file);
            setImageName(file.name);
        }
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCropSave = async () => {
        try {
            const croppedImageBlob = await getCroppedImg(croppingImage, croppedAreaPixels);
            setImage(croppedImageBlob);
            setIsCropModalOpen(false);
            alert("Cropped image saved successfully!");
        } catch (err) {
            console.error("Error cropping image:", err);
            alert("Failed to crop image.");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsCropModalOpen(false);
    };

    return (
        <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Edit Post
            </Typography>
            <form onSubmit={updatePost}>
                <TextField
                    label="Title"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <TextField
                    label="Subheading"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={subheading}
                    onChange={(e) => setSubheading(e.target.value)}
                />
                <Button variant="outlined" color="primary" onClick={() => setIsModalOpen(true)} sx={{ mb: 2 }}>
                    Enlarge Content Editor
                </Button>
                <TextField
                    label="Content"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    sx={{ mb: 2 }}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <TextField
                    label="Search Keywords"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={keywordSearch}
                    onChange={handleKeywordSearch}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="keyword-select-label">Keywords</InputLabel>
                    <Select
                        labelId="keyword-select-label"
                        multiple
                        value={selectedKeywords}
                        onChange={handleKeywordChange}
                        renderValue={(selected) => selected.map((id) => {
                            const keyword = keywords.find(k => k.key_id === id);
                            return keyword ? keyword.word : "";
                        }).join(', ')}
                    >
                        {keywords.map((keyword) => (
                            <MenuItem key={keyword.key_id} value={keyword.key_id}>
                                {keyword.word}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        const keyword = window.prompt("Enter a new keyword:");
                        if (keyword) {
                            addKeyword(keyword);
                        }
                    }}
                    sx={{ mb: 2 }}
                >
                    Add New Keyword
                </Button>
                <TextField
                    label="Search Authors"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={authorSearch}
                    onChange={handleAuthorSearch}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="author-select-label">Authors</InputLabel>
                    <Select
                        labelId="author-select-label"
                        multiple
                        value={selectedAuthors}
                        onChange={handleAuthorChange}
                        renderValue={(selected) => selected.map((id) => {
                            const author = authors.find(a => a.id === id);
                            return author ? author.username : "";
                        }).join(', ')}
                    >
                        {authors.map((author) => (
                            <MenuItem key={author.id} value={author.id}>
                                {author.username}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Link to Paper"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={linkToPaper}
                    onChange={(e) => setLinkToPaper(e.target.value)}
                />
                <Button variant="contained" component="label" sx={{ mb: 2 }}>
                    Upload Image
                    <input type="file" hidden onChange={handleImageUpload} />
                </Button>
                <Modal open={isCropModalOpen} onClose={closeModal}>
                    <Box
                        sx={{
                            width: '80%',
                            height: '80%',
                            margin: 'auto',
                            mt: 5,
                            p: 2,
                            backgroundColor: 'grey',
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
                                aspect={4 / 3}
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
                {imageName && (
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Uploaded file: {imageName}
                    </Typography>
                )}
                <Box className="checkbox-section">
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={myWork}
                                onChange={(e) => setMyWork(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="This is my/our original work"
                    />
                </Box>
                <Button type="submit" variant="contained" color="primary">
                    Update Post
                </Button>
            </form>

            <Modal open={isModalOpen} onClose={closeModal}>
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
                        justifyContent: 'space-between'
                    }}
                >
                    <TextField
                        label="Content"
                        multiline
                        rows={30}
                        fullWidth
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        variant="outlined"
                        sx={{
                            flexGrow: 1,
                            width: '100%',
                            height: '80%'
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2, alignSelf: 'flex-end' }}
                        onClick={closeModal}
                    >
                        Close
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
}

export default PostEditForm;
