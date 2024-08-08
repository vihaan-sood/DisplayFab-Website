import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import api from "../api";
import Header from "../components/Header";
import ClickableTag from "../components/ClickableTag";
import { Typography, Box } from "@mui/material";
import ToLocalDate from "../components/ToLocalDate";


import "../styles/ExpandedPost.css";



function ExpandedPostPage() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [markdown, setMarkdown] = useState("");

    useEffect(() => {
        api.get(`/api/posts/${id}/`)
            .then((response) => {
                setPost(response.data);
                if (response.data.content && response.data.content.id) {
                    fetchMarkdownContent(response.data.content.id);
                }
            })
            .catch((error) => {
                console.error('Error fetching post details:', error);
            });
    }, [id]);

    const fetchMarkdownContent = (contentId) => {
        api.get(`/api/markdowntext/${contentId}/`)
            .then((response) => {
                setMarkdown(response.data.content);
            })
            .catch((error) => {
                console.error('Error fetching markdown content:', error);
            });
    };

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header />
            <div className="expanded-post-container">
                <h1>{post.title}</h1>
                <ToLocalDate dateString={post.date_created}/>
                <h2>{post.subheading}</h2>
                <div className="post-authors">
                    <strong>Authors:</strong> {post.authors.map(author => author.username).join(", ")}
                </div>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                <Box component="span" sx={{ fontWeight: 'bold' }}>Keywords:{" "}</Box>
                <Box component="span" sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginLeft: '8px' }}>
                    {post.keywords && post.keywords.map((keyword) => (
                        <ClickableTag key={keyword} keyword={keyword.word} onSearch={() => { }} />
                    ))}
                </Box>
            </Typography>
                <a className="post-link" href={post.link_to_paper} target="_blank" rel="noopener noreferrer">
                    Link to Paper
                </a>
                {post.image && (
                    <img className="post-image" src={post.image} alt={post.title} onError={(e) => e.target.style.display = 'none'} />
                )}
                <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[gfm]}>{markdown}</ReactMarkdown>
                </div>
            </div>
        </>
    );
}

export default ExpandedPostPage;
