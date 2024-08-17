import "../styles/Header.css"
import React from "react"
import { Link } from "react-router-dom"
import logo from "../assets/Untitled.png"

import SearchBar from "./Searchbar"

import { AppBar, Toolbar, Box, Typography } from "@mui/material";

import { FaRegUserCircle, FaSignOutAlt, FaUsers } from "react-icons/fa";
import { BsQuestionCircleFill } from "react-icons/bs";
import { ImBooks } from "react-icons/im";
import { AiOutlinePlus } from "react-icons/ai";

function Header({ onSearch }) {
    return (

        <div className="header-container">
            <AppBar
                position="static"
                sx={{
                    backgroundColor: "transparent",
                    boxShadow: "none",
                    padding: "30px 0", // Increase vertical padding for height
                }}
            >
                <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Link to="/">
                            <img src={logo} alt="logo" style={{ height: "60px", marginRight: "15px" }} /> {/* Increase logo height */}
                        </Link>
                    </Box>
                    <Typography
                        variant="h4"
                        component={Link}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            textAlign: "center",
                            color: "black",
                            textDecoration: "none", // Remove underline from link
                            ":hover": { color: "gray" }, // Change color on hover
                        }}
                    >
                        Active Materials Library
                    </Typography>
                    <Box sx={{ width: "60px" }} /> 
                </Toolbar>
            </AppBar>
            <nav className="navbar">
                <ul>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                    <li>< SearchBar onSearch={onSearch} /></li>
                    <li><Link to="/about" title="About Us" alt="About Us"><BsQuestionCircleFill /></Link></li>
                    <li><Link to="/listview" title="All Posts" alt="All Posts"><ImBooks /></Link></li>
                    <li><Link to="/logout" title="Log Out" alt="Log Out"> <FaSignOutAlt /></Link></li>
                    <li><Link to="/users" title="Users" alt="Users"> <FaUsers /></Link></li>
                    <li> <Link to="/createpost"><AiOutlinePlus /></Link></li>
                    <li><Link to="/myprofile" alt="My Profile" title="My Profile"><FaRegUserCircle /></Link></li>
                </ul>

            </nav>
        </div>
    );
};

export default Header;