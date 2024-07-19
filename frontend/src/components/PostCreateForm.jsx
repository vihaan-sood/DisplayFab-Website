import React, { useState, useEffect } from "react";
import api from "../api";
import "../styles/PostCreateForm.css"; 

function PostCreateForm({ onPostCreated }) {
    const [title, setTitle] = useState("");
    const [subheading, setSubheading] = useState("");
    const [content, setContent] = useState("");
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [linkToPaper, setLinkToPaper] = useState("");
    const [authors, setAuthors] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [image, setImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newKeyword, setNewKeyword] = useState("");
    const [keywordSearch, setKeywordSearch] = useState("");
    const [authorSearch, setAuthorSearch] = useState("");
    const [modalContent, setModalContent] = useState("");

    useEffect(() => {
        fetchKeywords();
        fetchAuthors();
    }, []);

    const fetchKeywords = async (searchTerm = "") => {
        try {
            const res = await api.get(`/api/keywords/?search=${searchTerm}`);
            setKeywords(res.data);
        } catch (err) {
            console.error("Error fetching keywords:", err);
        }
    };

    const fetchAuthors = async (searchTerm = "") => {
        try {
            const res = await api.get(`/api/authors/?search=${searchTerm}`);
            setAuthors(res.data);
        } catch (err) {
            console.error("Error fetching authors:", err);
        }
    };

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

    const createPost = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("subheading", subheading);
            formData.append("content", JSON.stringify({ content: modalContent }));
            selectedKeywords.forEach(keyword => formData.append("keywords", keyword));
            selectedAuthors.forEach(author => formData.append("authors", author));
            formData.append("link_to_paper", linkToPaper);
            if (image) {
                formData.append("image", image);
            }

            const postRes = await api.post("/api/posts/create/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (postRes.status === 201) {
                alert("Post Created");
                onPostCreated(postRes.data);
                setTitle("");
                setSubheading("");
                setContent("");
                setSelectedKeywords([]);
                setLinkToPaper("");
                setSelectedAuthors([]);
                setImage(null);
            } else {
                alert("Post Creation Was Not Successful");
            }
        } catch (err) {
            console.error("Error creating post:", err);
            if (err.response && err.response.data) {
                console.error("Server response:", err.response.data);
                alert(`Error: ${JSON.stringify(err.response.data)}`);
            }
        }
    };

    const addKeyword = async () => {
        try {
            const res = await api.post("/api/keywords/create/", { word: newKeyword });
            if (res.status === 201) {
                setNewKeyword("");
                fetchKeywords();
                alert("Keyword Added");
            }
        } catch (err) {
            console.error("Error adding keyword:", err);
        }
    };

    const handleKeywordSearch = (e) => {
        setKeywordSearch(e.target.value);
        fetchKeywords(e.target.value);
    };

    const handleAuthorSearch = (e) => {
        setAuthorSearch(e.target.value);
        fetchAuthors(e.target.value);
    };

    const openModal = () => {
        setModalContent(content);
        setIsModalOpen(true);
    };

    const saveModalContent = () => {
        setContent(modalContent);
        setIsModalOpen(false);
    };

    return (
        <div className="create-post-section">
            <h2>Create a Post</h2>
            <form onSubmit={createPost}>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
                <input type="text" value={subheading} onChange={(e) => setSubheading(e.target.value)} placeholder="Subheading" />
                <div className="content-section">
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content (accepts markdown)" required></textarea>
                    <button type="button" onClick={openModal}>Enlarge</button>
                </div>
                <button type="button" onClick={saveModalContent}>Save Content</button>
                <p>Keywords (hold Ctrl for multiple select) </p>
                <input type="text" value={keywordSearch} onChange={handleKeywordSearch} placeholder="Search Keywords" />
                <select multiple={true} value={selectedKeywords} onChange={handleKeywordChange}>
                    {keywords.length > 0 ? (
                        keywords.map((keyword) => (
                            <option key={keyword.key_id} value={keyword.key_id}>
                                {keyword.word}
                            </option>
                        ))
                    ) : (
                        <option disabled>No results</option>
                    )}
                </select>
                <input type="text" value={newKeyword} onChange={(e) => setNewKeyword(e.target.value)} placeholder="Add Keyword" />
                <button type="button" onClick={addKeyword}>Add Keyword</button>
                <p>Authors (hold Ctrl for multiple select)</p>
                <input type="text" value={authorSearch} onChange={handleAuthorSearch} placeholder="Search Authors" />
                <select multiple={true} value={selectedAuthors} onChange={handleAuthorChange}>
                    {authors.length > 0 ? (
                        authors.map((author) => (
                            <option key={author.id} value={author.id}>
                                {author.username}
                            </option>
                        ))
                    ) : (
                        <option disabled>No results</option>
                    )}
                </select>
                <input type="url" value={linkToPaper} onChange={(e) => setLinkToPaper(e.target.value)} placeholder="Link to Paper" />
                <p>Upload an image</p>
                <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                <button type="submit">Create Post</button>
            </form>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <textarea
                            value={modalContent}
                            onChange={(e) => setModalContent(e.target.value)}
                            placeholder="Content"
                            style={{ height: "80vh", width: "100%" }}
                            required
                        ></textarea>
                        <button type="button" onClick={saveModalContent}>Save</button>
                        <button type="button" onClick={() => setIsModalOpen(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PostCreateForm;

