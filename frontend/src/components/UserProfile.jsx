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

import { Avatar, Box, Paper, Grid, Typography} from "@mui/material";

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
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Box sx={{ maxWidth: 800, width: "100%", textAlign: "center" }}>
                    <Paper elevation={3} sx={{ padding: 3, marginY: 2, textAlign: "left" }}>
                        <Avatar alt={userDetails.username} src={userDetails.image} sx={{ width: 100, height: 100, mx: "auto" }} />
                        <Box sx={{ marginY: 2 }}>
                            <Typography variant="h6">Details</Typography>
                            <Typography>Name: {userDetails.first_name} {userDetails.last_name}</Typography>
                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box component="span" sx={{ fontWeight: 'bold' }}>Interested In:{" "}</Box>
                                <Box component="span" sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginLeft: '8px' }}>
                                    {userDetails.user_keywords && userDetails.user_keywords.map((keyword) => (
                                        <ClickableTag key={keyword} keyword={keyword.word} onSearch={() => {}} />
                                    ))}
                                </Box>
                            </Typography>
                        </Box>
                    </Paper>

                    <Paper elevation={3} sx={{ padding: 3, marginY: 2, textAlign: "left" }}>
                        <Typography variant="h6" sx={{ textAlign: "center" }}>About</Typography>
                        {userDetails.about_me ? (
                            <ReactMarkdown remarkPlugins={[gfm]}>{userDetails.about_me}</ReactMarkdown>
                        ) : (
                            <Typography variant="body1" color="textSecondary" sx={{ textAlign: "center" }}>
                                About section is empty
                            </Typography>
                        )}
                    </Paper>

                    <Paper elevation={3} sx={{ padding: 3, marginY: 2 }}>
                        <Typography variant="h6">User Posts</Typography>
                        {posts.length > 0? (
                        <Box sx={{ maxHeight: 300, overflowY: 'scroll', border: '1px solid #ddd', padding: 2, borderRadius: 2 }}>
                            <Grid container spacing={2}>
                                {posts.map((post) => (
                                    <Grid item key={post.id} xs={12}>
                                        <Post post={post} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box> ) : (
                            <Typography variant="body1" color="textSecondary" sx={{ textAlign: "center", marginTop: 2 }}>
                                No posts yet
                            </Typography>
                        )}
                    </Paper>

                    <Paper elevation={3} sx={{ padding: 3, marginY: 2 }}>
                        <Typography variant="h6">User Bookmarks</Typography>
                        { bookmarks.length > 0 ? (
                        
                        <Box sx={{ marginTop: 2 }}>
                            {bookmarks.length > 0 && (
                                <Carousel items={bookmarks.map(bookmark => bookmark.post)} />
                            )}
                        </Box> ) : (
                            <Typography variant="body1" color="textSecondary" sx={{ textAlign: "center", marginTop: 2 }}>
                                User has not bookmarked any posts.
                            </Typography>
                        )}
                    </Paper>
                </Box>
            </Box>
        </>
    );
}

export default UserProfile;