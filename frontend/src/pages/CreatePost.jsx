import React from "react";
import Header from "../components/Header";
import PostCreateForm from "../components/PostCreateForm";

function CreatePostPage() {
    const handlePostCreated = (newPost) => {
        console.log("New post created:", newPost);
    };

    return (
        <>
            <Header />
            <div className="create-post-page">
                <PostCreateForm onPostCreated={handlePostCreated} />
            </div>
        </>
    );
}

export default CreatePostPage;