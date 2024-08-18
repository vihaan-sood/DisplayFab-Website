import React, { useState, useEffect } from "react";
import api from "../api";
import {
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    FormHelperText,
    Box,
    Typography,
    Modal,
    Checkbox,
    FormControlLabel,
    Chip,
} from "@mui/material";

function PostCreateForm({ onPostCreated }) {
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

    useEffect(() => {
        fetchKeywords();
        fetchAuthors();
    }, []);

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

    const createPost = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("subheading", subheading);
            formData.append("content", JSON.stringify({ content }));
            selectedKeywords.forEach(keyword => formData.append("keywords", keyword));
            selectedAuthors.forEach(author => formData.append("authors", author));
            formData.append("link_to_paper", linkToPaper);
            formData.append("my_work", myWork);

            if (image) {
                formData.append("image", image);
            }

            const postRes = await api.post("/api/posts/create/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                requiresAuth: true,
            });

            if (postRes.status === 201) {
                alert("Post Created");
                onPostCreated(postRes.data);
                resetForm();
            } else {
                alert("Post Creation Was Not Successful");
            }
        } catch (err) {
            console.error("Error creating post:", err);
            if (err.response && err.response.data) {
                console.error("Server response:", err.response.data);
                alert(`Error: ${JSON.stringify(err.response.data)}`);
            }
        }
    };

    const resetForm = () => {
        setTitle("");
        setSubheading("");
        setContent("");
        setSelectedKeywords([]);
        setLinkToPaper("");
        setSelectedAuthors([]);
        setImage(null);
        setMyWork(false);
    };

    const addKeyword = async () => {
        try {
            const res = await api.post("/api/keywords/create/", { word: newKeyword }, { requiresAuth: true });
            if (res.status === 201) {
                setNewKeyword("");
                fetchKeywords();
                alert("Keyword Added");
            }
        } catch (err) {
            console.error("Error adding keyword:", err);
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

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Create a Post
            </Typography>
            <form onSubmit={createPost}>
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
                <Button variant="outlined" color="primary" onClick={openModal} sx={{ mb: 2 }}>
                    Enlarge Content Editor
                </Button>
                <TextField
                    label="Content"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    sx={{ mb: 2 }}
                    value={content} // The content will remain here even after editing in the modal
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
                    <FormHelperText>Hold Ctrl to select multiple keywords</FormHelperText>
                </FormControl>
                {selectedKeywords.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Selected Keywords:</Typography>
                        {selectedKeywords.map((keywordId) => {
                            const keyword = keywords.find(k => k.key_id === keywordId);
                            return keyword ? (
                                <Chip key={keyword.key_id} label={keyword.word} sx={{ margin: 0.5 }} />
                            ) : null;
                        })}
                    </Box>
                )}
                
                <Button variant="contained" color="secondary" onClick={addKeyword} sx={{ mb: 2 }}>
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
                        value={selectedAuthors} // This is the selected authors state
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
                    <FormHelperText>Hold Ctrl to select multiple authors</FormHelperText>
                </FormControl>
                {selectedAuthors.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Selected Authors:</Typography>
                        {selectedAuthors.map((authorId) => {
                            const author = authors.find(a => a.id === authorId);
                            return author ? (
                                <Chip key={author.id} label={author.username} sx={{ margin: 0.5 }} />
                            ) : null;
                        })}
                    </Box>
                )}
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
                    <input type="file" hidden onChange={(e) => setImage(e.target.files[0])} />
                </Button>
                <Box className="checkbox-section">
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={myWork}
                                onChange={(e) => setMyWork(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="This is my work"
                    />
                </Box>
                <Button type="submit" variant="contained" color="primary">
                    Create Post
                </Button>
            </form>

            <Modal open={isModalOpen} onClose={closeModal}>
                <Box sx={{ width: '80%', height: '80vh', margin: 'auto', mt: 5, p: 2, backgroundColor: '#fff', boxShadow: 24 }}>
                    <TextField
                        label="Content"
                        multiline
                        rows={10}
                        fullWidth
                        value={content} // Directly bind the main content state
                        onChange={(e) => setContent(e.target.value)}
                        variant="outlined"
                    />
                    <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }} onClick={closeModal}>
                        Close
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
}

export default PostCreateForm;

