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
                borderColor: "#ffffff",
                gap: 1, // Adds space between the TextField and Button
                width:'100%',
            }}
        >
            <TextField
                variant="outlined"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by keyword or title..."
                size="large"
                sx={{
                    flex: 1,
                    backgroundColor: '#ffffff',
                    color: '#FFFFFF',
                    alignItems: 'center',
                    borderRadius: '50px',
                    borderColor: "#ffffff",
                    padding: '0 10px',
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'transparent', // Removes the border
                        }, '&:hover fieldset': {
                            borderColor: 'transparent', // Removes the border on hover
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'transparent', // Removes the border when focused
                        },


                    }
                }
                }
            />

        </Box>
    );
}

export default SearchBar;



