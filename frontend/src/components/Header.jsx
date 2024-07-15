import "../styles/Header.css"
import React from "react"
import {Link} from "react-router-dom"
import logo from "../assets/Untitled.png"

function Header() {
    return (
        <div>
            <div className="header-left">
                <img src={logo} alt="logo" className="logo" />
            </div>
            <nav className="navbar">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/listview">List View</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                    <li><Link to="/logout">Logout</Link></li>
                    <li><Link to="/myprofile">My Profile</Link></li>
                </ul>
            </nav>
        </div>
    );
};

export default Header;