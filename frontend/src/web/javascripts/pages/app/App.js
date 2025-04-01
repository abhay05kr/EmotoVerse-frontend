import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "../Signin/SIgnInPage";
import SignUpPage from "../Signup/SignUpPage";
import Dashboard from "../dashboard/dashboard";
import SpotifyCallbackPage from "../spotifycallback/SpotifyCallbackPage";

const ProtectedRoute = ({ element }) => {
    const userId = localStorage.getItem("userId");
    return userId ? element : <Navigate to="/signin" />;
};

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const authStatus = localStorage.getItem("userId") !== null;
        setIsAuthenticated(authStatus);
    }, []);

    const handleSignInStatus = (authStatus) => {
        setIsAuthenticated(authStatus);
        if (!authStatus) {
            localStorage.removeItem("userId");
        }
    };

    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<SignUpPage />} />
                    <Route path="/signin" element={<SignInPage onSignIn={handleSignInStatus} />} />
                    <Route path="/spotify-callback" element={<SpotifyCallbackPage />} />
                    <Route path="/dashboard/*" element={<ProtectedRoute element={<Dashboard />} />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
