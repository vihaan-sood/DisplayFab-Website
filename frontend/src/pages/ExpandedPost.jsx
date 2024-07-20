import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import MarkdownPage from "../components/Markdownpage";
import Header from "../components/Header";
import "../styles/ExpandedPost.css";

function ExpandedPostPage() {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        api.get(`/api/posts/${id}/`)
            .then((response) => {
                setPost(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error fetching post details:', error);
            });
    }, [id]);

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header />
            <div className="expanded-post-container">
                <h1>{post.title}</h1>
                <h2>{post.subheading}</h2>
                <div className="post-authors">
                    <strong>Authors:</strong> {post.authors.join(", ")}
                </div>
                <div className="post-keywords">
                    <strong>Keywords:</strong> {post.keywords.join(", ")}
                </div>
                <a className="post-link" href={post.link_to_paper} target="_blank" rel="noopener noreferrer">
                    Link to Paper
                </a>
                {post.image && (
                    <img className="post-image" src={post.image} alt={post.title} onError={(e) => e.target.style.display = 'none'} />
                )}
                <div className="markdown-content">
                    <MarkdownPage pk={post.content.id} />
                </div>
            </div>
        </>
    );
}

export default ExpandedPostPage;
