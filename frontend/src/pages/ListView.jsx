import React, { useState, useEffect } from "react";
import api from "../api";
import Post from "../components/Post";
import Header from "../components/Header";
import "../styles/ListView.css";

function ListView() {
    const [posts, setPosts] = useState([]);

    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        handleSearch(searchQuery);
    }, [searchQuery, posts]);



    const fetchPosts = async () => {
        try {
            const res = await api.get("/api/posts/");
            setPosts(res.data);
            setFilteredPosts(res.data);
        } catch (err) {
            console.error("Error fetching posts:", err);
        }
    };

    const handleSearch = () => {
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
    };


        return (
            <>
                <Header onSearch={setSearchQuery} />
                <div className="list-view">
                    <h1>ListView</h1>
                    <div>

                        <h2>Posts</h2>
                        {filteredPosts.map((post) => (
                            <Post key={post.id} post={post} />
                        ))}
                    </div>
                </div>
            </>
        );
    }

    export default ListView;
