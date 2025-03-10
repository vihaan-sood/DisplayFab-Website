import React from "react";
import { Card, CardMedia, CardContent, CardActions, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Bookmark from "./BookmarkButton";

export default function PostCard({ post }) {
  return (
    <Card 
      sx={{ 
        maxWidth: 345, 
        bgcolor: "#f9f9f9", 
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)', 
          bgcolor: '#E6E6E6', 
        }
      }}
    >
      <CardContent sx={{ paddingBottom: 0 }}>
        <Typography gutterBottom variant="h5" component="div">
          {post.title}
        </Typography>
      </CardContent>
      
      <Link to={`/post/${post.id}`}>
        {post.image && (
          <CardMedia
            sx={{ height: 140 }}
            image={post.image}
            title={post.title}
            onError={(e) => e.target.style.display = 'none'}
          />
        )}
      </Link>

      <CardActions>
        <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
            <Bookmark postId={post.id} />
        </Box>
      </CardActions>
    </Card>
  );
}
