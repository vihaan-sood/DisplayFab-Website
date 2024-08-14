import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import api from "../api";
import Header from "../components/Header";
import ClickableTag from "../components/ClickableTag";
import { Typography, Box, Button } from "@mui/material";
import ToLocalDate from "../components/ToLocalDate";
import { FaRegCircleCheck  } from "react-icons/fa6";
import { RxCrossCircled } from "react-icons/rx";
import Carousel from "../components/Carousel";

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
            <div className="expanded-post-container">
                <h1>{post.title}</h1>
                <ToLocalDate dateString={post.date_created} />
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
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                    <Box component="span" sx={{ fontWeight: 'bold' }}>My Work:{" "}</Box>
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', marginLeft: 1 }}>
                        {post.my_work ? (
                            <FaRegCircleCheck/>
                        ) : (
                            <RxCrossCircled/>
                        )}
                        <Box component="span" sx={{ marginLeft: 1 }}>
                            {post.my_work ? "The contents of this post are original" : "This is not my work"}
                        </Box>
                    </Box>
                </Typography>
                <Button component={Link} to={`/report/${id}`} variant="contained" color="secondary" sx={{ marginTop: 2 }}>
                    Report Post
                </Button>

                <Box sx={{ marginY: 2 }}>
                    <Typography variant="h6">Linked Posts</Typography>
                    <Box sx={{ marginTop: 2 }}>
                        {linkedPosts.length > 0 && (
                            <Carousel items={linkedPosts} />
                        )}
                    </Box>
                </Box>

            </div>
        </>
    );
}

export default ExpandedPostPage;
