import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Avatar from '@mui/material/Avatar';
import api from "../api";
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import { Button, Box, Typography, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Carousel from "../components/Carousel";
import ClickableTag from "../components/ClickableTag";

function MyProfile() {
    const [userDetails, setUserDetails] = useState(null);
    const [posts, setPosts] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [otherPosts, setOtherPosts] = useState([]);

    useEffect(() => {
        getCurrentUser();
    }, []);

    const getCurrentUser = async () => {
        
        try {
            const res = await api.get('/api/user/currentuser/', { requiresAuth: true });
            const currentUser = res.data;
            console.log(currentUser.user_keywords)
            
            // Once we have the current user, fetch all necessary details
            getUserDetails(currentUser.id);
            getOtherUserPosts(currentUser.id);
            getUserBookmarks(currentUser.id);
            getUserPosts();
        } catch (err) {
            console.error('Error fetching current user:', err);
        }
    };

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
            const res = await api.get(`/api/posts/myposts/`, { requiresAuth: true });
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
                <Typography variant="h4" textAlign={"center"}>Your Profile</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Box sx={{ maxWidth: 800, width: "100%", textAlign: "center" }}>
                    <Paper elevation={3} sx={{ padding: 3, marginY: 2, textAlign: "left" }}>
                        <Avatar alt={userDetails.username} src={userDetails.image} sx={{ width: 100, height: 100, mx: "auto" }} />
                        <Box sx={{ marginY: 2 }}>
                            <Typography>Name: {userDetails.first_name} {userDetails.last_name}</Typography>
                            <Typography>Registered email: {userDetails.email}</Typography>
                            <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', marginBottom: 2 }}>
                                <Box component="span" sx={{ fontWeight: 'bold' }}>Interests:{" "}</Box>
                                <Box component="span" sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginLeft: '8px' }}>
                                {userDetails.user_keywords &&
                                userDetails.user_keywords.map((keyword) => (
                                    <ClickableTag
                                        key={keyword.word}
                                        keyword={keyword.word}
                                        onSearch={() => {}}
                                    />
                                ))}
                                </Box>
                            </Typography>
                            <Button
                                component={RouterLink}
                                to="/edit-details"
                                variant="contained"
                                sx={{ marginTop: 2 }}
                            >
                                Edit Details
                            </Button>
                        </Box>
                    </Paper>

                    <Paper elevation={3} sx={{ padding: 3, marginY: 2, textAlign: "left" }}>
                        <Typography variant="h4" sx={{ textAlign: "center" }}>About</Typography>
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
                        <Box sx={{ marginY: 2 }}>
                            <Typography variant="h4">Your Posts</Typography>
                            <Box sx={{ marginTop: 2 }}>
                                {posts.length > 0 && (
                                    <Carousel items={posts} />
                                )}
                            </Box>
                            <Button
                                component={RouterLink}
                                to={`/manage-posts/${userDetails.id}`}
                                variant="contained"
                                sx={{ marginTop: 2 }}
                            >
                                Manage
                            </Button>
                        </Box>
                    </Paper>

                    <Paper elevation={3} sx={{ padding: 3, marginY: 2 }}>
                        <Box sx={{ marginY: 2 }}>
                            <Typography variant="h4">Bookmarks</Typography>
                            <Box sx={{ marginTop: 2 }}>
                                {bookmarks.length > 0 && (
                                    <Carousel items={bookmarks.map(bookmark => bookmark.post)} />
                                )}
                            </Box>
                            <Button
                                component={RouterLink}
                                to="/manage-bookmarks"
                                variant="contained"
                                sx={{ marginTop: 2 }}
                            >
                                Manage
                            </Button>
                        </Box>
                    </Paper>

                    <Paper elevation={3} sx={{ padding: 3, marginY: 2 }}>
                        <Box sx={{ marginY: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Posts You're Featured In
                            </Typography>
                            <Box sx={{ marginTop: 2 }}>
                                {otherPosts.length > 0 && (
                                    <Carousel items={otherPosts} />
                                )}
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </>
    );
}

export default MyProfile;
