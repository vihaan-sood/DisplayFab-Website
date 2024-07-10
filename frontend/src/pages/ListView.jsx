import React, { useState, useEffect, useCallback } from "react";
import api from "../api";
import Post from "../components/Post";
import Header from "../components/Header";
import "../styles/ListView.css"; 

const useFetchData = (endpoint, setState) => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(endpoint);

                setState(res.data);
            } catch (err) {
                console.error(`Error fetching data from ${endpoint}:`, err);
            }
        };

        fetchData();
    }, [endpoint, setState]);
};

function ListView() {
    const [posts, setPosts] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [subheading, setSubheading] = useState("");
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [linkToPaper, setLinkToPaper] = useState("");
    const [authors, setAuthors] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [image, setImage] = useState(null);

    useFetchData("/api/posts/", setPosts);
    useFetchData("/api/keywords/", setKeywords);
    useFetchData("/api/authors/", setAuthors);

    const deletePost = useCallback((id) => {
        api.delete(`/api/posts/delete/${id}`)
            .then((res) => {
                if (res.status === 204) {
                    alert("Post Deleted");
                    setPosts((prevPosts) => prevPosts.filter(post => post.id !== id));
                } else {
                    alert("Post Deletion Was Not Successful");
                }
            })
            .catch((err) => console.error(err));
    }, []);

    const createPost = useCallback((e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("subheading", subheading);
        formData.append("content", content);
        formData.append("keywords", JSON.stringify(selectedKeywords)); 
        formData.append("link_to_paper", linkToPaper);
        formData.append("authors", JSON.stringify(selectedAuthors)); 
        if (image) {
            formData.append("image", image);
        }

        api.post("/api/posts/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then((res) => {
                if (res.status === 201) {
                    alert("Post Created");
                    setPosts((prevPosts) => [...prevPosts, res.data]);
                } else {
                    alert("Post Creation Was Not Successful");
                }
            })
            .catch((err) => console.error(err));
    }, [title, subheading, content, selectedKeywords, linkToPaper, selectedAuthors, image]);

    const handleKeywordChange = (e) => {
        const options = e.target.options;
        const selected = Array.from(options).filter(option => option.selected).map(option => parseInt(option.value));
        setSelectedKeywords(selected);
    };

    const handleAuthorChange = (e) => {
        const options = e.target.options;
        const selected = Array.from(options).filter(option => option.selected).map(option => parseInt(option.value));
        
        setSelectedAuthors(selected);
    };

    

    return (
        <>
            <Header />
            <div>
                <h1>ListView</h1>
                <div>
                    <h2>Posts</h2>
                    {posts.map((post) => (
                        <Post key={post.id} post={post} onDelete={deletePost} />
                    ))}
                </div>
                <h2>Add a Post</h2>
                <form onSubmit={createPost}>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
                    <input type="text" value={subheading} onChange={(e) => setSubheading(e.target.value)} placeholder="Subheading" />
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" required></textarea>
                    <p>Keywords</p>
                    <select multiple={true} value={selectedKeywords} onChange={handleKeywordChange}>
                        {keywords.map((keyword) => (
                            <option key={keyword.key_id} value={keyword.key_id}>
                                {keyword.word}
                            </option>
                        ))}
                    </select>
                    <p></p>
                    <input type="url" value={linkToPaper} onChange={(e) => setLinkToPaper(e.target.value)} placeholder="Link to Paper" />
                    <p>Authors</p>
                    <select multiple={true} value={selectedAuthors} onChange={handleAuthorChange}>
                        {authors.length > 0 ? (
                            authors.map((author) => (
                                <option key={author.id} value={author.id}>
                                    ID: {author.id}, Name:{author.username}
                                </option>
                            ))
                        ) : (
                            <option disabled>Loading authors...</option>
                        )}
                    </select>
                    <p>Upload an image</p>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                    <button type="submit">Create Post</button>
                </form>
            </div>
        </>
    );
}

export default ListView;