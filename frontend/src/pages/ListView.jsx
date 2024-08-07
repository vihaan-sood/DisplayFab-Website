import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import api from "../api";
import Post from "../components/Post";
import Header from "../components/Header";
import "../styles/ListView.css";

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
        }
        setFilteredPosts(sortedPosts);
    }, [sortOrder, filteredPosts]);

    return (
        <>
            <Header onSearch={setSearchQuery} />
            <div className="list-view">
                <h1>ListView</h1>
                <div className="sort-options">
                    <button onClick={() => setSortOrder("asc")}>Sort A-Z</button>
                    <button onClick={() => setSortOrder("desc")}>Sort Z-A</button>
                    <button onClick={() => window.location.reload()}>Reset</button>
                </div>
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
