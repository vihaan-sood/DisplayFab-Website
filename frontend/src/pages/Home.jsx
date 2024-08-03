import React, { useState, useEffect } from "react";
import api from "../api";
import Header from "../components/Header";
import MyGrid from "../components/MyGrid";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from "../components/PostCard";

function Home() {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchMoreData();
    }, []);

    const fetchMoreData = async () => {
        try {
            const res = await api.get(`/api/posts/`);
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
            <div>
                <h1>Home</h1>
            </div>
            <div>
                <InfiniteScroll
                    dataLength={posts.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                >
                    <MyGrid items={posts.map(post => <PostCard key={post.id} post={post} />)} columns={5} />
                </InfiniteScroll>
            </div>
        </>
    );
}

export default Home;
