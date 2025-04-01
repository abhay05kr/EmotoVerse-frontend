import { Button } from '@mui/material';
import { getAuth, signOut } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserDetails } from '../../../apiCalls/api';
import "../../styles/component/header.scss";

const Header = () => {
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();
    const auth = getAuth();
    const hasFetched = useRef(false);
    const userid = localStorage.getItem("userId");

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchUser();
        }
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem("userId");
            navigate('/signin');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const fetchUser = async () => {
        try {
            const response = await fetchUserDetails(userid);
            setUserName(response.firstName);
        } catch (error) {
            console.error('Failed to fetch user name:', error);
        }
    };

    return (
        <header className="header">
            <div className="header-content">
                <div>
                    <h1>Welcome, {userName ? userName : 'User'}!</h1>
                </div>
                <div className='header-menu-buttons'>
                    <Button onClick={() => navigate('/dashboard')}>Home</Button>
                    <Button onClick={() => navigate('/dashboard/model')}>Model</Button>
                    <Button onClick={() => navigate('/dashboard/suggestions')}>Suggestions</Button>
                    <Button onClick={() => navigate('/dashboard/chatbot')}>Chatbot</Button>
                    <Button onClick={() => navigate('/dashboard/profile')}>Profile</Button>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
