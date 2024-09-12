import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import {
    Box,
    Typography,
    Checkbox,
    Button,
    FormControlLabel,
    FormGroup,
} from "@mui/material";
import Header from "../components/Header";
import { UserContext } from "../UserContext";

function PostLinking() {
    const location = useLocation();
    const { postId } = location.state || {}; // Get the postId from the state
    const { user } = useContext(UserContext);
    const [posts, setPosts] = useState([]);
    const [selectedPosts, setSelectedPosts] = useState([]);
    const [linkedPosts, setLinkedPosts] = useState([]); // Initially linked posts 
    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts();
        fetchLinkedPosts(); // Fetch linked posts when the component loads
    }, []);

    // Fetch all posts excluding the current one
    const fetchPosts = async () => {
        try {
            const res = await api.get("/api/posts/", {
                headers: {
                    "Content-Type": "application/json",
                },
                requiresAuth: true,
            });

            const filteredPosts = res.data.filter((post) => post.id !== parseInt(postId, 10));

            console.log("Filtered posts (excluding current post):", filteredPosts);

            setPosts(filteredPosts);
        } catch (err) {
            console.error("Error fetching posts:", err);
        }
    };

    // Fetch the linked posts for the current post
    const fetchLinkedPosts = async () => {
        try {
            const res = await api.get(`/api/posts/linked/${postId}/`, {
                headers: {
                    "Content-Type": "application/json",
                },
                requiresAuth: true,
            });

            const linkedPostIds = res.data.map((linkedPost) =>
       
                linkedPost.post1 === parseInt(postId, 10) ? linkedPost.post2 : linkedPost.post1
            ) // Extract linked post IDs

            setLinkedPosts(linkedPostIds);
            setSelectedPosts(linkedPostIds); // Pre-select the linked posts
        } catch (err) {
            console.error("Error fetching linked posts:", err);
        }
    };

    console.log(selectedPosts);
    // Handle the checkbox selection
    const handleSelectPost = (event) => {
        const selectedId = parseInt(event.target.value);
        setSelectedPosts((prevSelected) =>
            event.target.checked
                ? [...prevSelected, selectedId] // Add post if checked
                : prevSelected.filter((id) => id !== selectedId) // Remove post if unchecked
        );
    };

    // Handle linking the selected posts
    const handleLinkPosts = async () => {

        const addedPosts = selectedPosts.filter((id) => !linkedPosts.includes(id)); // Posts to be added
        const removedPosts = linkedPosts.filter((id) => !selectedPosts.includes(id)); // Posts to be removed


        try {
            for (const selectedPostId of addedPosts) {
                await api.post(
                    "api/posts/linked/create/",
                    {
                        post1: postId,
                        post2: selectedPostId,
                    },
                    { requiresAuth: true }
                );
                console.log(`Linked post ${postId} with ${selectedPostId}`);
            }

            // Delete links for posts that were removed
            for (const removedPostId of removedPosts) {
                await api.delete(`/api/posts/linked/delete/${postId}/${removedPostId}/`, {
                    headers: { "Content-Type": "application/json" },
                    requiresAuth: true,
                });
                console.log(`Removed link between post ${postId} and ${removedPostId}`);
            }

            alert("Post linking successfull!");
            navigate(`/`);
        } catch (err) {
            console.error("Error updating post links:", err);
            alert("Error updating post links.");
        }
    };

    return (
        <>
            <Header />
            <Box sx={{ maxWidth: 800, margin: "0 auto", padding: 2 }}>
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
                                    checked={selectedPosts.includes(post.id)} // Pre-check if the post is already linked
                                />
                            }
                            label={`${post.id} : ${post.title} - ${post.subheading || "No subheading"}`}
                        />
                    ))}
                </FormGroup>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLinkPosts} // Link all selected posts
                    sx={{ mt: 2 }}
                >
                    Link Selected Posts
                </Button>
            </Box>
        </>
    );
}

export default PostLinking;
