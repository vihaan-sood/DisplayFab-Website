import React, { useState, useEffect } from "react";
import api from "../api";
import Post from "../components/Post";
import Header from "../components/Header";
import "../styles/ListView.css";

const useFetchData = (endpoint, setState) => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(endpoint);
                setState(res.data);
            } catch (err) {
                console.error(`Error fetching data from ${endpoint}:`, err);
            }
        };

        fetchData();
    }, [endpoint, setState]);
};

function ListView() {
    const [posts, setPosts] = useState([]);

    useFetchData("/api/posts/", setPosts);

    return (
        <>
            <Header />
            <div className="list-view">
                <h1>ListView</h1>
                <div>
                    <h2>Posts</h2>
                    {posts.map((post) => (
                        <Post key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </>
    );
}

export default ListView;