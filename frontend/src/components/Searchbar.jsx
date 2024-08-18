import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box } from "@mui/material";

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
        <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1, // Adds space between the TextField and Button
            }}
        >
            <TextField
                variant="filled"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by keyword or title..."
                size="small"
                sx={{ flex: 1 }} // Makes the TextField take up available space
            />
            <Button
                variant="contained"
                color="primary"
                type="submit"
            >
                Search
            </Button>
        </Box>
    );
}

export default SearchBar;



