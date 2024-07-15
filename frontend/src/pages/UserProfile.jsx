import React, { useState, useEffect } from "react";
import api from "../api";
import Post from "../components/Post";
import Header from "../components/Header";
import "../styles/UserProfile.css"; // Ensure this path is correct

function UserProfile() {
    const [userDetails, setUserDetails] = useState({});
    const [posts, setPosts] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [subheading, setSubheading] = useState("");
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [linkToPaper, setLinkToPaper] = useState("");
    const [authors, setAuthors] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [image, setImage] = useState(null);

    // Assuming you have a way to get the userId, e.g., from context, props, or a global state
    const userId = 1; // Replace with actual user ID

    useEffect(() => {
        getUserDetails(userId);
        getPosts();
        getKeywords();
        getAuthors();
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

    const getKeywords = () => {
        api.get("/api/keywords/")
            .then((res) => {
                setKeywords(res.data);
            })
            .catch((err) => console.error(err));
    };

    const getAuthors = () => {
        api.get("/api/authors/")
            .then((res) => {
                setAuthors(res.data);
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
const createPost = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subheading", subheading);
    formData.append("content", content);
    
    // Append keywords and authors as arrays, not JSON strings
    selectedKeywords.forEach(keyword => formData.append("keywords", keyword));
    selectedAuthors.forEach(author => formData.append("authors", author));

    formData.append("link_to_paper", linkToPaper);
    if (image) {
        formData.append("image", image);
    }

    api.post("/api/posts/create/", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
        .then((res) => {
            if (res.status === 201) {
                alert("Post Created");
                setPosts((prevPosts) => [...prevPosts, res.data]);
            } else {
                alert("Post Creation Was Not Successful");
            }
        })
        .catch((err) => {
            console.error("Error creating post:", err);
            if (err.response && err.response.data) {
                console.error("Server response:", err.response.data);
                alert(`Error: ${JSON.stringify(err.response.data)}`);
            }
        });
};

    const handleKeywordChange = (e) => {
        const options = e.target.options;
        const selected = Array.from(options).filter(option => option.selected).map(option => parseInt(option.value));
        setSelectedKeywords(selected);
    };

    const handleAuthorChange = (e) => {
        const options = e.target.options;
        const selected = Array.from(options).filter(option => option.selected).map(option => parseInt(option.value));
        setSelectedAuthors(selected);
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
                </div>
                <div className="create-post-section">
                    <h2>Create a Post</h2>
                    <form onSubmit={createPost}>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
                        <input type="text" value={subheading} onChange={(e) => setSubheading(e.target.value)} placeholder="Subheading" />
                        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" required></textarea>
                        <p>Keywords</p>
                        <select multiple={true} value={selectedKeywords} onChange={handleKeywordChange}>
                            {keywords.map((keyword) => (
                                <option key={keyword.key_id} value={keyword.key_id}>
                                    {keyword.word}
                                </option>
                            ))}
                        </select>
                        <p>Authors</p>
                        <select multiple={true} value={selectedAuthors} onChange={handleAuthorChange}>
                            {authors.length > 0 ? (
                                authors.map((author) => (
                                    <option key={author.id} value={author.id}>
                                        {author.username}
                                    </option>
                                ))
                            ) : (
                                <option disabled>Loading authors...</option>
                            )}
                        </select>
                        <input type="url" value={linkToPaper} onChange={(e) => setLinkToPaper(e.target.value)} placeholder="Link to Paper" />
                        <p>Upload an image</p>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                        <button type="submit">Create Post</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default UserProfile;

