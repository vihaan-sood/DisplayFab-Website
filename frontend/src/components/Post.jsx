import React from "react";
import "../styles/Post.css";
import { Link } from "react-router-dom";
import Bookmark from "./BookmarkButton"


function Post({ post}) {
    // const date = new Date(post.created_at).toLocaleDateString("en-GB");

    return (
        <div className="post-container">
            <p className="post-title">Title :{post.title}</p>
            <p className="post-subheading">Subheading:{post.subheading}</p>
            <p className="post-subheading">Subheading: {post.subheading}</p>
            {post.content && post.content.id && (
                <Link to={`/post/${post.id}`} className="post-content-link">Expand</Link>
            )}
           <p className="post-keywords">
                Keywords: {post.keywords.map(keywords => keywords.word).join(", ")}
            </p>
            <p className="post-authors">Authors:{post.authors.join(", ")}</p> 
            <a className="post-link" href={post.link_to_paper} target="_blank" rel="noopener noreferrer">
                Link to Paper
            </a>
            {post.image && (
                <img className="post-image" src={post.image} alt={post.title} onError={(e) => e.target.style.display = 'none'} />
            )}
            {/* <p className="post-date">{date}</p> */}
            <Bookmark postId={post.id} />
        </div>
    );
}

export default Post;