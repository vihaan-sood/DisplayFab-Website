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
                console.log(postsDetails);
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
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" gutterBottom>
                            {post.title}
                        </Typography>
                        <ToLocalDate dateString={post.date_created} />
                        <Typography variant="h6" sx={{ marginTop: 2 }}>
                            {post.subheading}
                        </Typography>
                    </Box>
                    <Divider sx={{ marginY: 2 }} />
                    <Typography variant="body1" sx={{ textAlign: 'center', marginBottom: 2 }}>
                        <strong>Authors:</strong> {post.authors.map(author => author.username).join(", ")}
                    </Typography>
                    <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Box component="span" sx={{ fontWeight: 'bold' }}>Keywords:{" "}</Box>
                        <Box component="span" sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginLeft: '8px' }}>
                            {post.keywords && post.keywords.map((keyword) => (
                                <ClickableTag key={keyword} keyword={keyword.word} onSearch={() => { }} />
                            ))}
                        </Box>
                    </Typography>
                    <Box sx={{ textAlign: 'center' }}>
                        <a href={post.link_to_paper} target="_blank" rel="noopener noreferrer">
                            <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
                                Link to Paper
                            </Button>
                        </a>
                    </Box>
                    {post.image && (
                        <Box sx={{ textAlign: 'center', marginY: 3 }}>
                            <img
                                src={post.image}
                                alt={post.title}
                                style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: 8 }}
                            />
                        </Box>
                    )}
                    <Divider sx={{ marginY: 2 }} />
                    <Box className="markdown-content" sx={{ marginBottom: 3 }}>
                        <ReactMarkdown remarkPlugins={[gfm]}>{markdown}</ReactMarkdown>
                    </Box>
                    <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', marginLeft: 1 }}>
                            {post.my_work ? (
                                <FaRegCircleCheck />
                            ) : (
                                <RxCrossCircled />
                            )}
                            <Box component="span" sx={{ marginLeft: 1 }}>
                                {post.my_work ? "The contents of this post are original" : "This is not my work"}
                            </Box>
                        </Box>
                    </Typography>
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
                    <Box sx={{ marginY: 4 }}>
                        <Typography variant="h4" sx={{ textAlign: "center", marginBottom: 2 }}>Linked Posts</Typography>
                        <Box sx={{ width: '100%', marginX: 'auto' }}>
                            {linkedPosts.length > 0 && (
                                <Carousel items={linkedPosts} sx={{ width: '100%', height: '500px' }} />
                            )}
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </>
    );
}

export default ExpandedPostPage;