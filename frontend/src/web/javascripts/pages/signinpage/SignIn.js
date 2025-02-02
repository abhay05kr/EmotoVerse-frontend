import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import SignInPage from "../../components/Signin/SIgnInPage";
import SignUpPage from "../../components/Signup/SignUpPage";

const SignIn = () => {
    const [handleSignIn, setHandleSignIn] = useState(false);

    
    useEffect(() => {
        const authStatus = localStorage.getItem("isAuthenticated") === "true";
        console.log("Auth Status from localStorage:", authStatus); 
        setHandleSignIn(authStatus);
    }, []);


    const handleSignInStatus = (authStatus) => {
        console.log("Updating Auth Status:", authStatus);
        setHandleSignIn(authStatus);
        localStorage.setItem("isAuthenticated", authStatus);
    };

    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<SignUpPage />} />
                    <Route path="/signin" element={<SignInPage onSignIn={handleSignInStatus} />} />
                </Routes>
            </Router>
        </div>
    );
};

export default SignIn;
