import "../styles/Header.css"
import React from "react"
import { Link } from "react-router-dom"
import logo from "../assets/Untitled.png"

import SearchBar from "./Searchbar"


import { FaRegUserCircle, FaSignOutAlt, FaUsers  } from "react-icons/fa";
import { BsQuestionCircleFill } from "react-icons/bs";
import { ImBooks } from "react-icons/im";
import { AiOutlinePlus } from "react-icons/ai";

function Header( { onSearch }) {
    return (

        <div className="header-container">
            <div className="header-left">
                <Link to="/">
                    <img src={logo} alt="logo" className="logo" />
                </Link>
                <Link to="/" className="home-link">
                    <h1>Active Materials Library</h1>
                </Link>
            </div>
            <nav className="navbar">
                <ul>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                    <li>< SearchBar onSearch={onSearch}/></li>
                    <li><Link to="/about" title="About Us" alt="About Us"><BsQuestionCircleFill /></Link></li>
                    <li><Link to="/listview"  title="All Posts" alt="All Posts"><ImBooks/></Link></li>
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