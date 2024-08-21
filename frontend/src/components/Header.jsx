import "../styles/Header.css"

import React from "react"
import { Link } from "react-router-dom"
import logo from "../assets/Untitled.png"

import SearchBar from "./Searchbar"

import { AppBar, Toolbar, Box, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";

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
                    padding: "30px 20px",
                }}
            >
                <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Link to="/">
                            <img src={logo} alt="logo" style={{ height: "100px", marginRight: "0px" }} /> 
                        </Link>
                    </Box>
                    <Typography
                        variant="h2"
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
            <nav className="navbar" >
           
                    <List sx={{ display: "flex", alignItems: "center", padding: 0, width: "100%" }}>
                        {/* Left side: Login and Register */}
                        <Box className="oval-box">
                            <ListItem className= "login_register" component={Link} to="/login">
                                <ListItemText  primary="Login" />
                            </ListItem>
                            <Divider orientation="vertical" flexItem />
                            <ListItem  className= "login_register" component={Link} to="/register">
                                <ListItemText  primary="Register" />
                            </ListItem>
                        </Box>
                

                {/* Center: Search Bar */}
                <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", paddingX: 2 }}>

                    <SearchBar onSearch={onSearch} />
                </Box>

                {/* Right side: Other Buttons */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Divider orientation="vertical" flexItem />
                    <ListItem component={Link} to="/about">
                        <BsQuestionCircleFill size = {30} className="list-item" title="About Us" alt="About Us" />
                    </ListItem>
                    <Divider orientation="vertical" flexItem />
                    <ListItem component={Link} to="/listview">
                        <ImBooks size = {30}  className="list-item" title="All Posts" alt="All Posts" />
                    </ListItem>
                    <Divider orientation="vertical" flexItem />
                    <ListItem component={Link} to="/logout">
                        <FaSignOutAlt size = {30}   className="list-item" title="Log Out" alt="Log Out" />
                    </ListItem>
                    <Divider orientation="vertical" flexItem />
                    <ListItem component={Link} to="/users">
                        <FaUsers size = {30}  className="list-item" title="Users" alt="Users" />
                    </ListItem>
                    <Divider orientation="vertical" flexItem />
                    <ListItem component={Link} to="/createpost">
                        <AiOutlinePlus size = {30}  className="list-item" />
                    </ListItem>
                    <Divider orientation="vertical" flexItem />
                    <ListItem component={Link} to="/myprofile">
                        <FaRegUserCircle size = {30}  className="list-item" title="My Profile" alt="My Profile" />
                    </ListItem>
                </Box>
            </List>
        </nav>


        </div >
    );
};

export default Header;