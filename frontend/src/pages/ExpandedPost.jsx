import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import api from "../api";
import Header from "../components/Header";
import ClickableTag from "../components/ClickableTag";
import ToLocalDate from "../utils/ToLocalDate";
import { FaRegCircleCheck } from "react-icons/fa6";
import { RxCrossCircled } from "react-icons/rx";
import Carousel from "../components/Carousel";
import { Typography, Box, Button, Paper, Divider } from "@mui/material";

import "../styles/ExpandedPost.css";

function ExpandedPostPage() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [markdown, setMarkdown] = useState("");
    const [linkedPosts, setLinkedPosts] = useState([]);

    useEffect(() => {
        api.get(`/api/posts/${id}/`)
            .then((response) => {
                setPost(response.data);
                if (response.data.content && response.data.content.id) {
                    fetchMarkdownContent(response.data.content.id);
                }
                fetchLinkedPosts(response.data.id);
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

    const fetchLinkedPosts = (postId) => {
        api.get(`/api/posts/linked/${postId}/`)
            .then(async (res) => {
                const linkedPostsData = res.data;
   
                const postDetailsPromises = linkedPostsData.map(linkedPost =>
                    api.get(`/api/posts/${linkedPost.post2}/`).then(res => res.data)
                );
                const postsDetails = await Promise.all(postDetailsPromises);
                setLinkedPosts(postsDetails);
       
            })
            .catch((err) => console.error('Error fetching linked posts:', err));
    };

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header />
            <Box sx={{ maxWidth: '800px', margin: 'auto', padding: 3 }}>
                <Paper elevation={3} sx={{ padding: 3 }}>
                    
                    {/* Post ID and Date */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1" sx={{ color: 'gray', opacity: 0.7 }}>{post.id}</Typography>
                        <Typography variant="body1" sx={{ color: 'gray', opacity: 0.7 }}>
                            <ToLocalDate dateString={post.date_created} />
                        </Typography>
                    </Box>
    
                    {/* Title and Subheading */}
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" gutterBottom>
                            {post.title}
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'gray' }}>
                            {post.subheading || "No subheading provided."}
                        </Typography>
                    </Box>
    
                    <Divider sx={{ marginY: 2 }} />
    
                    {/* Authors and Keywords */}
                    <Typography variant="body1" sx={{ marginBottom: 2 }}>
                        <strong>Authors:</strong> {post.authors.length > 0 ? post.authors.map(author => author.username).join(", ") : "No authors registered."}
                    </Typography>
                    <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', marginBottom: 2 }}>
                        <Box component="span" sx={{ fontWeight: 'bold' }}>Keywords:{" "}</Box>
                        <Box component="span" sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginLeft: '8px' }}>
                            {post.keywords && post.keywords.length > 0 ? (
                                post.keywords.map((keyword) => (
                                    <ClickableTag key={keyword} keyword={keyword.word} onSearch={() => { }} />
                                ))
                            ) : (
                                <span>No keywords registered.</span>
                            )}
                        </Box>
                    </Typography>
    
                    {/* Markdown Content */}
                    <Box className="markdown-content" sx={{ marginBottom: 3 }}>
                        <ReactMarkdown remarkPlugins={[gfm]}>{markdown || "No content available."}</ReactMarkdown>
                    </Box>
    
                    <Divider sx={{ marginY: 2 }} />
    
                    {/* Image Section */}
                    {post.image ? (
                        <Box sx={{ textAlign: 'center', marginY: 3 }}>
                            <img
                                src={post.image}
                                alt={post.title}
                                style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: 8 }}
                            />
                        </Box>
                    ) : (
                        <Typography variant="body1" sx={{ textAlign: 'center', marginY: 2 }}>
                            No image registered.
                        </Typography>
                    )}
    
                    <Divider sx={{ marginY: 2 }} />
    
                    {/* External Link Section */}
                    <Box sx={{ textAlign: 'center', marginY: 2 }}>
                        {post.link_to_paper ? (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    const confirmExternalLink = window.confirm('WARNING!\nYou may be redirected to another website. Please proceed with caution.');
                                    if (confirmExternalLink) {
                                        window.open(post.link_to_paper, '_blank', 'noopener noreferrer');
                                    }
                                }}
                            >
                                External Link
                            </Button>
                        ) : (
                            <Typography variant="body1" sx={{ textAlign: 'center' }}>
                                No external link provided.
                            </Typography>
                        )}
                    </Box>
    
                    <Divider sx={{ marginY: 2 }} />
    
                    {/* My Work Indicator */}
                    <Typography variant="body1" sx={{ textAlign: 'center', marginBottom: 2 }}>
                        {post.my_work ? (
                            <>
                                <FaRegCircleCheck color="green" />
                                <span> This is my original work.</span>
                            </>
                        ) : (
                            <>
                                <RxCrossCircled color="red" />
                                <span> This is not my original work.</span>
                            </>
                        )}
                    </Typography>
    
                    {/* Report Post Button */}
                    <Box sx={{ textAlign: 'center', marginTop: 3 }}>
                        <Button
                            component={Link}
                            to={`/report/${id}`}
                            variant="outlined"
                            color="error"
                        >
                            Report Post
                        </Button>
                    </Box>
    
                    {/* Linked Posts Section */}
                    {linkedPosts.length > 0 ? (
                        <Box sx={{ marginY: 4 }}>
                            <Typography variant="h4" sx={{ textAlign: "center", marginBottom: 2 }}>
                                Linked Posts
                            </Typography>
                            <Box sx={{ width: '100%', marginX: 'auto' }}>
                                <Carousel items={linkedPosts} sx={{ width: '100%', height: '500px' }} />
                            </Box>
                        </Box>
                    ) : (
                        <Typography variant="body1" sx={{ textAlign: 'center', marginY: 2 }}>
                            No linked posts available.
                        </Typography>
                    )}
                </Paper>
            </Box>
        </>
    );
    
}

export default ExpandedPostPage;