import React, { useState, useEffect } from "react";
import api from "../api";
import Post from "../components/Post";
import Header from "../components/Header";
import "../styles/UserProfile.css";
import { Link } from "react-router-dom";

function UserProfile() {
    const [userDetails, setUserDetails] = useState({});
    const [posts, setPosts] = useState([]);


    const userId = 1;

    useEffect(() => {
        getUserDetails(userId);
        getPosts();
    }, [userId]);

    const getUserDetails = (userId) => {
        api.get(`/api/user/myprofile/${userId}/`)
            .then((res) => {
                setUserDetails(res.data);
            })
            .catch((err) => console.error(err));
    };

    const getPosts = () => {
        api.get("/api/posts/")
            .then((res) => {
                setPosts(res.data);
            })
            .catch((err) => console.error(err));
    };

    const deletePost = (id) => {
        api.delete(`/api/posts/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) {
                    alert("Post Deleted");
                    setPosts((prevPosts) => prevPosts.filter(post => post.id !== id));
                } else {
                    alert("Post Deletion Was Not Successful");
                }
            })
            .catch((err) => console.error(err));
    };



    return (
        <>
            <Header />
            <div className="user-profile">
                <h1>User Profile</h1>
                <div className="user-details">
                    <h2>Details</h2>
                    <p>Name: {userDetails.username}</p>
                    <p>Email: {userDetails.email}</p>
                </div>
                <div className="posts-section">
                    <h2>Your Posts</h2>
                    {posts.map((post) => (
                        <Post key={post.id} post={post} onDelete={() => deletePost(post.id)} />
                    ))}
                    <Link to="/createpost">Create New Post</Link>
                </div>
            </div>
        </>
    );
}

export default UserProfile;


