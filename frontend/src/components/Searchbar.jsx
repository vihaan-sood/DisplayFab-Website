import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Searchbar.css"; 

function SearchBar({ onSearch, initialQuery = "" }) {
    const [query, setQuery] = useState(initialQuery);
    const navigate = useNavigate();

    useEffect(() => {
        if (initialQuery) {
            setQuery(initialQuery);
            onSearch(initialQuery);
        }
    }, [initialQuery, onSearch]);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate("/listview", { state: { query } });
        onSearch(query);
    };

    return (
        <form onSubmit={handleSearch} className="search-bar">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by keyword or title..."
            />
            <button type="submit">Search</button>
        </form>
    );
}

export default SearchBar;


