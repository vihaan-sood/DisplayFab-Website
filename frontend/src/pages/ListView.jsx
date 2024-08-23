import React, { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button, Box, Typography, Grid } from "@mui/material";
import api from "../api";
import Post from "../components/Post";
import Header from "../components/Header";

function ListView() {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("default");

    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.query) {
            setSearchQuery(location.state.query);
        }
    }, [location.state]);

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        handleSearch();
    }, [searchQuery, posts]);

    useEffect(() => {
        handleSort();
    }, [sortOrder]);

    const fetchPosts = async () => {
        try {
            const res = await api.get("/api/posts/");
            setPosts(res.data);
            setFilteredPosts(res.data);
        } catch (err) {
            console.error("Error fetching posts:", err);
        }
    };

    const handleSearch = useCallback(() => {
        if (searchQuery === "") {
            setFilteredPosts(posts);
        } else {
            const lowercasedQuery = searchQuery.toLowerCase();
            const filtered = posts.filter((post) => {
                const titleMatch = post.title && post.title.toString().toLowerCase().includes(lowercasedQuery);
                const keywordMatch = post.keywords && post.keywords.some((keyword) => keyword && keyword.word && keyword.word.toLowerCase().includes(lowercasedQuery));
                return titleMatch || keywordMatch;
            });
            setFilteredPosts(filtered);
        }
    }, [searchQuery, posts]);

    const handleSort = useCallback(() => {
        let sortedPosts = [...filteredPosts];
        if (sortOrder === "asc") {
            sortedPosts.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
        } else if (sortOrder === "desc") {
            sortedPosts.sort((a, b) => b.title.toLowerCase().localeCompare(a.title.toLowerCase()));
        } else if (sortOrder === "newest") {
            sortedPosts.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
        } else if (sortOrder === "oldest") {
            sortedPosts.sort((a, b) => new Date(a.date_created) - new Date(b.date_created));
        } 
        setFilteredPosts(sortedPosts);
    }, [sortOrder, filteredPosts]);

    const handleReset = () => {
        setSearchQuery(""); // Reset the search query
    };

    return (
        <>
            <Header onSearch={setSearchQuery} />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Box sx={{ maxWidth: 800, width: "100%", textAlign: "center" }}>
                    <Typography variant="h4" gutterBottom>
                        The Shelves
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}>
                    <Button 
                            variant={sortOrder === "asc" ? "contained" : "outlined"} 
                            onClick={() => setSortOrder("asc")}
                        >
                            Sort A-Z
                        </Button>
                        <Button 
                            variant={sortOrder === "desc" ? "contained" : "outlined"} 
                            onClick={() => setSortOrder("desc")}
                        >
                            Sort Z-A
                        </Button>
                        <Button 
                            variant={sortOrder === "newest" ? "contained" : "outlined"} 
                            onClick={() => setSortOrder("newest")}
                        >
                            Newest First
                        </Button>
                        <Button 
                            variant={sortOrder === "oldest" ? "contained" : "outlined"} 
                            onClick={() => setSortOrder("oldest")}
                        >
                            Oldest First
                        </Button>
                        <Link to="/listview" onClick={handleReset} style={{ textDecoration: "none" }}>
                            <Button variant="outlined">Reset </Button>
                        </Link>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ maxWidth: 1200, width: "100%" }}>
                    <Grid container spacing={2}>
                        {filteredPosts.map((post) => (
                            <Grid item xs={12} key={post.id}>
                                <Post post={post} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        </>
    );
}

export default ListView;


