import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Lightbulb, User, MessageCircle, Info } from 'lucide-react';
import "../styles/component/navbar.scss"

const Navbar = () => {
    return (
        <nav className="navbar">
            <ul className="navbar-menu">
                <li>
                    <NavLink to="/home" className="navbar-link" activeClassName="active">
                        <Home size={20} />
                        <span>Home</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/suggestion" className="navbar-link" activeClassName="active">
                        <Lightbulb size={20} />
                        <span>Suggestions</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/chatbot" className="navbar-link" activeClassName="active">
                        <MessageCircle size={20} />
                        <span>Chatbot</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/profile" className="navbar-link" activeClassName="active">
                        <User size={20} />
                        <span>Profile</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/about" className="navbar-link" activeClassName="active">
                        <Info size={20} />
                        <span>About</span>
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;