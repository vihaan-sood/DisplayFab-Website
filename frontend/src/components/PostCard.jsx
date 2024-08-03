import React from "react";
import { Card, CardMedia, CardContent, CardActions, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Bookmark from "./BookmarkButton";


export default function PostCard({ post }) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      {post.image && (
        <CardMedia
          sx={{ height: 140 }}
          image={post.image}
          title={post.title}
          onError={(e) => e.target.style.display = 'none'}
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {post.subheading}
        </Typography>
        
        
      </CardContent>
      <CardActions>
        <Bookmark postId={post.id} />
        <Button size="small" component={Link} to={`/post/${post.id}`}>Expand</Button>
      </CardActions>
    </Card>
  );
}
