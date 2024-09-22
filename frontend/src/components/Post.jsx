import React from "react";
import "../styles/Post.css";
import { Link } from "react-router-dom";
import Bookmark from "./BookmarkButton"
import ClickableTag from "./ClickableTag";
import ToLocalDate from "../utils/ToLocalDate";
import { Typography, Box, Divider, Paper } from "@mui/material";
import noImage from "../assets/no_image.webp";


function Post({ post }) {

    const imageUrl = post.image ? post.image : noImage;

    return (
        <div className="post-container">
            <Link to={`/post/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Paper
            
                elevation={3}
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: "center",
                    padding: 2,
                    marginBottom: 2,
                    gap: 2,
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    '&:hover': {
                        transform: "scale(1.02)"
                    }
                }}
                
            >
                <Box
                    component="img"
                    src={imageUrl}
                    alt={post.title}
                    sx={{
                        width: { xs: "100%", md: 150 },
                        height: 150,
                        objectFit: "cover",
                        borderRadius: 1,
                        marginBottom: { xs: 2, md: 0 }
                    }}
                />
                <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                        {post.title}
                    </Typography>
                    <ToLocalDate dateString={post.date_created} />
                    <Typography
                        variant="body1"
                        sx={{ display: "flex", alignItems: "center", marginTop: 1 }}
                    >
                        <Box component="span" sx={{ fontWeight: "bold" }}>
                            Keywords:{" "}
                        </Box>
                        <Box
                            component="span"
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "8px",
                                marginLeft: "8px",
                            }}
                        >
                            {post.keywords &&
                                post.keywords.map((keyword) => (
                                    <ClickableTag
                                        key={keyword.word}
                                        keyword={keyword.word}
                                        onSearch={() => {}}
                                    />
                                ))}
                        </Box>
                    </Typography>
                </Box>
                <Bookmark postId={post.id} />
            </Paper>
        </Link>
 
        </div>
    );
}

export default Post;