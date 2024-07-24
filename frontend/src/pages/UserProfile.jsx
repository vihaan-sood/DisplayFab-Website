import React, { useState, useEffect, useContext } from "react";
import api from "../api";
import Post from "../components/Post";
import Header from "../components/Header";
import "../styles/UserProfile.css";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";


function UserProfile() {
    const [userDetails, setUserDetails] = useState({});
    const [posts, setPosts] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);

    const user = useContext(UserContext);
    const navigate = useNavigate();



    useEffect(() => {
        if (user) {
            getUserDetails(user.id);
            getUserPosts(user.id);
            getUserBookmarks(user.id);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            navigate(`/myprofile`, { replace: true });
        }
    }, []);

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
                    <div className="bookmarks-section">
                    <h2>Your Bookmarks</h2>
                    {bookmarks.map((bookmark) => (
                        <div key={bookmark.id}>
                            <p>Bookmark ID: {bookmark.id}</p>
                            <Post post={bookmark.post} />
                        </div>
                    ))}
                </div>
                </div>
            </div>
        </>
    );
}

export default UserProfile;


