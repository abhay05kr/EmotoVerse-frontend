import { TextField } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserDetails, userLogin } from "../../../apiCalls/api";
import "../../styles/component/signin/signin.scss";

const SignInPage = ({ onSignIn }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [authError, setAuthError] = useState("");
    const navigate = useNavigate();
    const getauthstatus=JSON.parse(localStorage.getItem('isAuthenticated'));
    const validateEmail = (nameValue) => (!nameValue ? "Email is required" : "");
    
    const validatePassword = (passwordValue) => {
        if (!passwordValue) {
            return "Password is required";
        }
        if (passwordValue.length < 8) {
            return "Password must be at least 8 characters long";
        }
        return "";
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            email: validateEmail(value),
        }));
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            password: validatePassword(value),
        }));
    };

    const handleData = (signupData) => {
        localStorage.setItem("tokens", JSON.stringify(signupData));
    };

    const getDetails = async (token) => {
        try {
            const user = await fetchUserDetails(token);
            localStorage.setItem("userId", JSON.stringify(user._id));
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        if (!emailError && !passwordError) {
            try {
                const result = await userLogin(email, password);
                console.log("Login successful:", result);

                setAuthError("");
                handleData(result);

                await getDetails(result.token);
                onSignIn(getauthstatus); 
                navigate("/dashboard");
            } catch (error) {
                console.error("Error logging in:", error);
                setAuthError(error.message || "An error occurred. Please try again.");
            }
        } else {
            setErrors({
                email: emailError,
                password: passwordError,
            });
        }
    };

    return (
        <div className="signin-auth-container">
            <div className="signin-auth-form">
                <h2>Sign In</h2>
                <form onSubmit={handleSubmit}>
                    <div className="signin-input-group">
                        <TextField
                            type="text"
                            label="Email"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Enter your Email"
                            InputLabelProps={{ shrink: "true" }}
                        />
                        {submitted && errors.email && (
                            <p className="error-message">{errors.email}</p>
                        )}
                    </div>
                    <div className="signin-input-group">
                        <TextField
                            type="password"
                            label="Password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="Enter your password"
                            InputLabelProps={{ shrink: "true" }}
                        />
                        {submitted && errors.password && (
                            <p className="error-message">{errors.password}</p>
                        )}
                    </div>
                    {authError && <p className="error-message">{authError}</p>}
                    <button type="submit" className="auth-btn">Sign In</button>
                </form>
                <p>
                    Don't have an account? <a href="/">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default SignInPage;
