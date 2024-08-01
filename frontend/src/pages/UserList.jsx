import React, { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import Header from "../components/Header";
// import "../styles/UserList.css";

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
        <div className="user-list">
            <Header />
            <h1>User List</h1>
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search users by username"
            />
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <Link to={`/userprofile/${user.id}`}>
                          
                            {user.username}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserList;
