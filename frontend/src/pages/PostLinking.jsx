import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../api";
import {
    Box,
    Typography,
    Checkbox,
    Button,
    FormControlLabel,
    FormGroup,
} from "@mui/material";

function PostLinking() {
    const location = useLocation();
    const { postId } = location.state || {}; // Get the postId from the state

    const [posts, setPosts] = useState([]);
    const [selectedPosts, setSelectedPosts] = useState([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await api.get("/api/posts/", {
                headers: {
                    "Content-Type": "application/json",
                },
                requiresAuth: true,
            });
            setPosts(res.data.filter(post => post.id !== postId));
        } catch (err) {
            console.error("Error fetching posts:", err);
        }
    };

    const handleSelectPost = (event) => {
        const selectedId = parseInt(event.target.value);
        setSelectedPosts((prevSelected) =>
            event.target.checked
                ? [...prevSelected, selectedId]
                : prevSelected.filter((id) => id !== selectedId)
        );
    };

    const handleLinkPosts = async () => {
        try {
            await Promise.all(
                selectedPosts.map(async (selectedPostId) => {
                    await api.post("/api/linkedposts/create/", {
                        post1: postId,
                        post2: selectedPostId,
                    });
                })
            );
            alert("Posts Linked Successfully!");
        } catch (err) {
            console.error("Error linking posts:", err);
            alert("Error linking posts.");
        }
    };

    return (
        <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Link Posts
            </Typography>
            <FormGroup>
                {posts.map((post) => (
                    <FormControlLabel
                        key={post.id}
                        control={
                            <Checkbox
                                value={post.id}
                                onChange={handleSelectPost}
                            />
                        }
                        label={`${post.id} : ${post.title} - ${post.subheading}`}
                    />
                ))}
            </FormGroup>
            <Button
                variant="contained"
                color="primary"
                onClick={handleLinkPosts}
                sx={{ mt: 2 }}
            >
                Link Selected Posts
            </Button>
        </Box>
    );
}

export default PostLinking;
