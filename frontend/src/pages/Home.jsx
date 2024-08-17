import React, { useState, useEffect } from "react";
import api from "../api";
import Header from "../components/Header";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from "../components/PostCard";
import { Grid, Box, Typography } from "@mui/material";
import Centering from "../components/Centering";

function Home() {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchMoreData();
    }, []);

    const fetchMoreData = async () => {
        try {
            const res = await api.get(`/api/posts/?page=${page}`);
            const newPosts = res.data;

            setPosts((prevPosts) => [...prevPosts, ...newPosts]);
            setPage((prevPage) => prevPage + 1);

            if (newPosts.length === 0) {
                setHasMore(false);
            }
        } catch (err) {
            console.error("Error fetching posts:", err);
            setHasMore(false);
        }
    };

    return (
        <>
            <Header />
            <Box sx={{ padding: 2, display: 'flex', justifyContent: 'center' }}>
                <Typography variant="h4" sx={{ mb: 4 }}>Home</Typography>
            </Box>
            <Centering>
                <Box >


                    <InfiniteScroll
                        dataLength={posts.length}
                        next={fetchMoreData}
                        hasMore={hasMore}
                        loader={<Typography align="center">Loading...</Typography>}
                        endMessage={
                            <Typography align="center" sx={{ mt: 2 }}>
                                <b>Yay! You have seen it all</b>
                            </Typography>
                        }
                    >
                        <Box sx={{ maxWidth: '1200px', width: '100%', margin: 'auto' }}>
                            <Grid container spacing={2}>
                                {posts.map((post) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={post.id}>
                                        <PostCard post={post} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </InfiniteScroll>
                </Box>
            </Centering>
        </>
    );
}

export default Home;