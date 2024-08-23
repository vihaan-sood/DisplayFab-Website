import React, { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { Box, Typography, List, ListItem, Divider, TextField } from "@mui/material";
import ClickableTag from "../components/ClickableTag";

function UserList() {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get("/api/users/");
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        if (query === "") {
            fetchUsers();
        } else {
            const filteredUsers = users.filter((user) =>
                user.username.toLowerCase().includes(query.toLowerCase())
            );
            setUsers(filteredUsers);
        }
    };

    return (
        <>
            <Header onSearch={setSearchQuery} />
            <Box sx={{ maxWidth: 800, margin: "auto", padding: 2 }}>

                <Typography variant="h4" gutterBottom>
                    User List
                </Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search users by username"
                    sx={{ marginBottom: 2 }}
                />
                <List>
                    {users.map((user) => (
                        <React.Fragment key={user.id}>
                            <ListItem alignItems="flex-start">
                                <Box sx={{ width: "100%" }}>
                                    <Typography variant="h6" component={Link} to={`/userprofile/${user.id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                                        {user.username}
                                    </Typography>
                                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box component="span" sx={{ fontWeight: 'bold' }}>Keywords:{" "}</Box>
                                        <Box component="span" sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginLeft: '8px' }}>
                                            {user.user_keywords && user.user_keywords.length > 0 ? (
                                                user.user_keywords.map((keyword) => (
                                                    <ClickableTag key={keyword} keyword={keyword.word} onSearch={() => { }} />
                                                ))
                                            ) : (
                                                <Typography variant="body2" color="textSecondary">No keywords available</Typography>
                                            )}
                                        </Box>
                                    </Typography>
                                </Box>
                            </ListItem>
                            <Divider component="li" />
                        </React.Fragment>
                    ))}
                </List>
            </Box>
        </>
    );
}

export default UserList;
