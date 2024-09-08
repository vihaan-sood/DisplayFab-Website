import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Avatar from '@mui/material/Avatar';
import { UserContext } from "../UserContext";
import api from "../api";
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import { Button, Box, Typography, Grid, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Post from "../components/Post";
import Carousel from "../components/Carousel";

function MyProfile() {
    const { user } = useContext(UserContext);
    const [userDetails, setUserDetails] = useState(null);
    const [posts, setPosts] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [otherPosts, setOtherPosts] = useState([]);

    useEffect(() => {
        if (user) {
            getUserDetails(user.id);
            getOtherUserPosts(user.id);
            getUserBookmarks(user.id);
            getUserPosts();
        }
    }, [user]);

    const getUserDetails = async (userId) => {
        try {
            const res = await api.get(`/api/user/myprofile/${userId}/`);
            setUserDetails(res.data);
        } catch (err) {
            console.error('Error fetching user details:', err);
        }
    };

    const getOtherUserPosts = async (userId) => {
        try {
            const res = await api.get(`/api/posts/userspecific/${userId}/`);
            setOtherPosts(res.data);
        } catch (err) {
            console.error('Error fetching user posts:', err);
        }
    };

    const getUserPosts = async () => {
        try {
            const res = await api.get(`api/posts/myposts/`, { requiresAuth: true });
            setPosts(res.data);
        } catch (err) {
            console.error('Error fetching user posts:', err);
        }
    };

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
        }
    };

    if (!userDetails) {
        return <h2>Loading...</h2>;
    }

    return (
        <>
            <Header />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Typography variant="h4" textAlign={"center"}>Your Profile</Typography></Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>

                <Box sx={{ maxWidth: 800, width: "100%", textAlign: "center" }}>
                    <Paper elevation={3} sx={{ padding: 3, marginY: 2, textAlign: "left" }}>
                        <Avatar alt={userDetails.username} src={userDetails.image} sx={{ width: 100, height: 100, mx: "auto" }} />

                        <Box sx={{ marginY: 2 }}>

                            <Typography variant="h6">Details</Typography>
                            <Typography>Name: {userDetails.first_name} {userDetails.last_name}</Typography>
                            <Typography>Registered email: {userDetails.email}</Typography>
                        </Box>
                    </Paper>

                    <Paper elevation={3} sx={{ padding: 3, marginY: 2, textAlign: "left" }}>
                        <Typography variant="h6" sx={{ textAlign: "center" }}>About</Typography>
                        <ReactMarkdown remarkPlugins={[gfm]}>{userDetails.about_me}</ReactMarkdown>
                        <Button
                            component={RouterLink}
                            to="/edit-about-me"
                            variant="contained"
                            sx={{ marginTop: 2 }}
                        >
                            Edit
                        </Button>
                    </Paper>
                    <Paper elevation={3} sx={{ padding: 3, marginY: 2 }}>
                        <Box sx={{ maxHeight: 300, overflowY: 'scroll', border: '1px solid #ddd', padding: 2, borderRadius: 2 }}>
                            <Button
                                component={RouterLink}
                                to={`/manage-posts/${user.id}`}
                                variant="contained"
                                sx={{ marginTop: 2 }}
                            >
                                Manage Your Posts
                            </Button>
                            <Grid container spacing={2}>
                                {posts.map((post) => (
                                    <Grid item key={post.id} xs={12}>
                                        <Post post={post} />
                                    </Grid>
                                ))}
                            </Grid>

                        </Box>
                    </Paper>
                    <Paper elevation={3} sx={{ padding: 3, marginY: 2 }}>
                        <Box sx={{ maxHeight: 300, overflowY: 'scroll', border: '1px solid #ddd', padding: 2, borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Posts You're Featured In
                            </Typography>
                            <Grid container spacing={2}>
                                {otherPosts.map((post) => (
                                    <Grid item key={post.id} xs={12}>
                                        <Post post={post} />
                                    </Grid>
                                ))}
                            </Grid>

                        </Box>
                    </Paper>
                    <Paper elevation={3} sx={{ padding: 3, marginY: 2 }}>
                        <Box sx={{ marginY: 2 }}>
                            <Button
                                component={RouterLink}
                                to="/manage-bookmarks"
                                variant="contained"
                                sx={{ marginTop: 2 }}
                            >
                                Manage Your Bookmarks
                            </Button>
                            <Box sx={{ marginTop: 2 }}>
                                {bookmarks.length > 0 && (
                                    <Carousel items={bookmarks.map(bookmark => bookmark.post)} />
                                )}
                            </Box>

                        </Box>
                    </Paper>
                </Box>
            </Box>
            `   `
        </>
    );
}

export default MyProfile;
