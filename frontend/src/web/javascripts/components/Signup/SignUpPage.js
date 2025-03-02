import TextField from '@mui/material/TextField';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from '../../../../fireBaseConfig';
import { userSignup } from "../../../apiCalls/api";
import { verifyOtpAndSetPassword } from '../../../apiCalls/api';
import "../../styles/component/signup/signup.scss";


const SignUpPage = () => {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [showOtpSection, setShowOtpSection] = useState(false);
    const [otpError, setOtpError] = useState("");
    const [apiError, setApiError] = useState("");

    const navigate = useNavigate();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateFirstName = (namevalue) => (namevalue && namevalue.length < 5 ? "First name is required" : "");
    const validateLastName = (namevalue) => (namevalue && namevalue.length < 5 ? "Last name is required" : "");
    const validateEmail = (emailValue) =>
        emailValue.length > 0 && !emailRegex.test(emailValue)
            ? "Invalid email format"
            : "";
    const validatePassword = (passwordValue) =>
        passwordValue && passwordValue.length < 8
            ? "Password must be at least 8 characters long"
            : "";
    const validateConfirmPassword = (confirmValue, passwordValue) =>
        confirmValue && confirmValue !== passwordValue
            ? "Passwords do not match"
            : "";
    const handleFirstNameChange = (e) => {
        const value = e.target.value;
        setFirstName(value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            firstName: validateFirstName(value),
        }));
    };
    const handleLastNameChange = (e) => {
        const value = e.target.value;
        setLastName(value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            lastName: validateLastName(value),
        }));
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
            password: value.length > 0 ? validatePassword(value) : "",
        }));
    };


    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            confirmPassword:
                value.length > 0 ? validateConfirmPassword(value, password) : "",
        }));
    };
    const handleOtpVerification = async (event) => {
        event.preventDefault();
        try {
            await auth.currentUser.reload(); 
    
            if (auth.currentUser.emailVerified) {
                const firebaseUID = auth.currentUser.uid;
    
                try {
                   
                    const result = await verifyOtpAndSetPassword(firstName, lastName, email, firebaseUID);
                    console.log("Registration successful:", result);
    
                    if (result) {
                        alert("Email verified successfully! You can now log in.");
                    }
                    navigate("/signin");
                    setFirstName("");
                    setLastName("");
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                    setErrors({});
                    setSubmitted(false);
    
                } catch (error) {
                    console.error("Registration failed:", error.message);
                    setErrors({ api: error.message });
                }
    
                console.log(auth.currentUser); 
    
            } else {
                setOtpError("Email not verified yet. Please check your inbox.");
            }
    
        } catch (error) {
            console.error("Error verifying email:", error);
            setOtpError("Something went wrong. Try again.");
        }
    };
    


    const handleVerifyEmail = async () => {
        setApiError("");
        setSubmitted(true);
        const firstNameError = validateFirstName(firstName);
        const lastNameError = validateLastName(lastName)
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        const confirmPasswordError = validateConfirmPassword(confirmPassword, password);
        if (!firstNameError && !lastNameError && !emailError && !passwordError && !confirmPasswordError) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                console.log(userCredential);
                await sendEmailVerification(user);
                alert("Verification email sent! Please check your inbox.");
                setShowOtpSection(true);
            } catch (error) {
                console.error("Error during Firebase Signup:", error.message);
                setApiError(error.message);
            }
        } else {
            setErrors({
                firstName: firstNameError,
                lastName: lastNameError,
                email: emailError,
                password: passwordError,
                confirmPassword: confirmPasswordError,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        const firstNameError = validateFirstName(firstName);
        const lastNameError = validateLastName(lastName)
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        const confirmPasswordError = validateConfirmPassword(confirmPassword, password);
        if (!firstNameError && !lastNameError && !emailError && !passwordError && !confirmPasswordError) {
            try {
                const result = await userSignup(firstName, lastName, email, password,);
                console.log("Registration successful:", result);
                setFirstName("");
                setLastName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setErrors({});
                setSubmitted(false);
                navigate("/signin");
            } catch (error) {
                console.error("Registration failed:", error.message);
                setErrors({ api: error.message });
            }
        } else {
            setErrors({
                firstName: firstNameError,
                lastName: lastNameError,
                email: emailError,
                password: passwordError,
                confirmPassword: confirmPasswordError,
            });
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Sign Up</h2>
                <form>
                    <div className='input-group-name'>
                        <div className="input-group-firstname">
                            <TextField
                                type="text"
                                label="First Name"
                                id="name"
                                value={firstName}
                                onChange={handleFirstNameChange}
                                placeholder="Enter First Name"
                                InputLabelProps={{ shrink: 'true' }}
                            />
                            {submitted && !firstName && <p className="error-message">First Name required</p>}
                            {errors.firstName && <p className="error-message">{errors.firstName}</p>}
                        </div>
                        <div className="input-group-firstname">
                            <TextField
                                type="text"
                                label="Last Name"
                                id="name"
                                value={lastName}
                                onChange={handleLastNameChange}
                                placeholder="Enter Last Name"
                                InputLabelProps={{ shrink: 'true' }}
                            />
                            {submitted && !lastName && <p className="error-message">Last Name required</p>}
                            {errors.lastName && <p className="error-message">{errors.lastName}</p>}
                        </div>
                    </div>
                    <div className="input-group">
                        <TextField
                            type="email"
                            label="Email"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Enter your email"
                            InputLabelProps={{ shrink: "true" }}
                        />
                        {submitted && !email && <p className="error-message">Email is required</p>}
                        {errors.email && <p className="error-message">{errors.email}</p>}

                    </div>

                    <div className="input-group">
                        <TextField
                            type="password"
                            label="Password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="Enter your password"
                            InputLabelProps={{ shrink: 'true' }}
                        />
                        {submitted && !password && (
                            <p className="error-message">Password is required</p>
                        )}
                        {errors.password && <p className="error-message">{errors.password}</p>}
                    </div>
                    <div className="input-group">
                        <TextField
                            type="password"
                            label="Confirm Password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            placeholder="Confirm your password"
                            InputLabelProps={{ shrink: 'true' }}
                        />
                        {submitted && !confirmPassword && (
                            <p className="error-message">Please confirm your password</p>
                        )}
                        {errors.confirmPassword && (
                            <p className="error-message">{errors.confirmPassword}</p>
                        )}
                    </div>

                    {showOtpSection && (
                        <div className="otp-container">
                            <h3>Check Your Email</h3>
                            <p>A verification link has been sent to your email. Click the link to verify your account.</p>
                            <button className="auth-btn" onClick={handleOtpVerification}>
                                I've Verified My Email
                            </button>
                        </div>
                    )}

                    {!showOtpSection && (
                        <button
                            type="button"
                            className="auth-btn verify-email-btn"
                            onClick={handleVerifyEmail}
                        >
                            Next
                        </button>
                    )}
                </form>
                <p>
                    Already have an account? <a href="/signin">Sign In</a>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;
