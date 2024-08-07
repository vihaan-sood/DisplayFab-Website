import React, { useState, useEffect, useContext } from "react";
import api from "../api";
import Post from "./Post";
import Header from "./Header";
import Carousel from "./Carousel"
import ClickableTag from "./ClickableTag";

import "../styles/UserProfile.css";
import { Link, useParams } from "react-router-dom";

import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

import { Avatar, Box, Button, Grid, Typography, Link as MuiLink } from "@mui/material";

function UserProfile() {
    const [userDetails, setUserDetails] = useState({});
    const [posts, setPosts] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [user_keywords, setUserKeywords] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            getUserDetails(id);
            getUserPosts(id);
            getUserBookmarks(id);
        }
    }, [id]);

    const getUserDetails = (userId) => {
        api.get(`/api/user/myprofile/${userId}/`)
            .then((res) => {
                setUserDetails(res.data);
                console.log(res.data)
            })
            .catch((err) => console.error(err));
    };

    const getUserPosts = (userId) => {
        api.get(`/api/posts/userspecific/${userId}/`)
            .then((res) => {
                setPosts(res.data);
            })
            .catch((err) => console.error(err));
    };

    const getUserBookmarks = (userId) => {
        api.get(`/api/user/bookmarks/${userId}/`)
            .then(async (res) => {
                const bookmarksData = res.data;
                const postDetailsPromises = bookmarksData.map(bookmark =>
                    api.get(`/api/posts/${bookmark.post}/`).then(res => res.data)
                );
                const postsDetails = await Promise.all(postDetailsPromises);
                setBookmarks(bookmarksData.map((bookmark, index) => ({ ...bookmark, post: postsDetails[index] })));
            })
            .catch((err) => console.error(err));
    };


    return (
        <>
            <Header />
            <Box sx={{ padding: 2 }}>
                <Typography variant="h4" gutterBottom>User Profile: {userDetails.username}</Typography>
                <Avatar alt={userDetails.username} src={userDetails.image} sx={{ width: 100, height: 100 }} />

                <Box sx={{ marginY: 2 }}>
                    <Typography variant="h6">Details</Typography>
                    <Typography>Name: {userDetails.first_name} {userDetails.last_name}</Typography>
                    <Typography variant="body1">
                        Keywords:{" "} 
                        {userDetails.user_keywords && userDetails.user_keywords.map((keyword) => (
                            <Button variant="outlined"><ClickableTag key={keyword} keyword={keyword.word} onSearch={() => {}} /></Button> 
                        ))}
                    </Typography>
                    <Typography variant="h6" sx={{ marginTop: 2 }}>About me</Typography>
                    <ReactMarkdown remarkPlugins={[gfm]}>{userDetails.about_me}</ReactMarkdown>

                </Box>

                <Box sx={{ marginY: 2 }}>
                    <Typography variant="h6">User Posts</Typography>
                    <Grid container spacing={2}>
                        {posts.map((post) => (
                            <Grid item key={post.id} xs={12}>
                                <Post post={post} onDelete={() => deletePost(post.id)} />
                            </Grid>
                        ))}
                    </Grid>
                    <Button component={MuiLink} to="/createpost" variant="contained" sx={{ marginTop: 2 }}>
                        Create New Post
                    </Button>
                </Box>

                <Box sx={{ marginY: 2 }}>
                    <Typography variant="h6">User Bookmarks</Typography>
                    <Box sx={{ marginTop: 2 }}>
                        {bookmarks.length > 0 && (
                            <Carousel items={bookmarks.map(bookmark => bookmark.post)} />
                        )}
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default UserProfile;