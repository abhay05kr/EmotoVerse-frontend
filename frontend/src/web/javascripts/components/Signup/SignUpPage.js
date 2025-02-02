import TextField from '@mui/material/TextField';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/component/signup/signup.scss";
import { userSignup, verifyOtpAndSetPassword } from "../../../apiCalls/api";


const SignUpPage = () => {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [age, setAge] = useState(0);
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [showOtpSection, setShowOtpSection] = useState(false);
    const [otpError, setOtpError] = useState("");
    const [apiError, setApiError] = useState("");

    const navigate = useNavigate();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateFirstName = (namevalue) => ( namevalue && namevalue.length<5 ? "First name is required" : "");
    const validateLastName = (namevalue) => (namevalue && namevalue.length<5? "Last name is required" : "");
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
    const validateAge=(incomevalue)=>
        incomevalue && incomevalue.length<2
        ? "Age must be in number" 
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
    const handleAgeChange = (e) => {
        const value = e.target.value;
        setAge(value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            age: validateAge(value),
        }));
    };

    // otp section 
    const handleOtpChange = (e, index) => {
        const value = e.target.value.replace(/[^0-9]/g, ""); // Only allow digits
        const newOtp = [...otp];
        newOtp[index] = value; // Set the current field's value
        setOtp(newOtp);
      
        // Move to the next input field if a digit is entered and not the last input
        if (value && index < 5) {
          document.getElementById(`otp-input-${index + 1}`).focus();
        }
      };
      
      const handleOtpKeyDown = (e, index) => {
        if (e.key === "Backspace") {
          const newOtp = [...otp];
          // Clear the current field
          if (otp[index]) {
            newOtp[index] = "";
            setOtp(newOtp);
          } else if (index > 0) {
            // If current field is already empty, move to the previous input
            document.getElementById(`otp-input-${index - 1}`).focus();
          }
        }
      };
      const handleOtpVerification = async () => {
        try {
            const otpString = otp.join("");
            const verifyResponse = await verifyOtpAndSetPassword(email, otpString, password);
            console.log("OTP verified and password set successfully:", verifyResponse);
            setShowOtpSection(false); // Hide OTP section on success
            setOtpError("");
            alert("Account created successfully. You can now sign in.");
        } catch (error) {
            console.error("Error verifying OTP:", error);
            setOtp(Array(6).fill("")); // Clear OTP fields
            setOtpError("Invalid OTP. Please try again.");
        }
    };
    
    const handleVerifyEmail = async () => {
    try {
        setOtp(Array(6).fill(""));
        const signupResponse = await userSignup(firstName, lastName, email, age);
        console.log("Signup successful:", signupResponse);
        setShowOtpSection(true); // Show OTP section
        setApiError(""); // Clear any previous API error
    } catch (error) {
        console.error("Error during signup:", error);
        setApiError(error || "An error occurred while signing up.");
    }
};

    
    
    const handleData = (signupdata) => {
        let existingData = localStorage.getItem("signupdata");
        existingData = existingData ? JSON.parse(existingData) : [];
        existingData.push(signupdata);
        localStorage.setItem("signupdata", JSON.stringify(existingData));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        const firstNameError = validateFirstName(firstName);
        const lastNameError=validateLastName(lastName)
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        const confirmPasswordError = validateConfirmPassword(confirmPassword, password);
        const ageError = validateAge(age);
        if (!firstNameError && !lastNameError && !emailError && !passwordError && !confirmPasswordError && !ageError) {
            try {
                const data = {firstName,lastName, email, age };
                const result = await userSignup(email, password, data); 
                console.log("Registration successful:", result);
                setFirstName("");
                setLastName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setAge("");
                setErrors({});
                setSubmitted(false);
                navigate("/signin"); 
            } catch (error) {
                console.error("Registration failed:", error.message);
                setErrors({ api: error.message });
            }
        } else {
            setErrors({
                firstName:firstNameError,
                lastName: lastNameError,
                email: emailError,
                password: passwordError,
                confirmPassword: confirmPasswordError,
                age: ageError,
            });
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className='input-group-name'>
                            <div className="input-group-firstname">
                                <TextField
                                    type="text"
                                    label="First Name"
                                    id="name"
                                    value={firstName}
                                    onChange={handleFirstNameChange}
                                    placeholder="Enter First Name"
                                    InputLabelProps={{shrink:'true'}}
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
                                    InputLabelProps={{shrink:'true'}}
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
                        
                        <button 
                            type="button" 
                            className="auth-btn verify-email-btn"
                            onClick={handleVerifyEmail}
                            disabled={!!errors.email || !email}
                        >
                            Verify Email
                        </button>

                        {showOtpSection && (
                            <div className="otp-container">
                                <h3>Enter OTP</h3>
                                <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                                    {otp.map((value, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            maxLength="1"
                                            value={value}
                                            onChange={(e) => handleOtpChange(e, index)}
                                            onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                border: "1px solid #ccc",
                                                textAlign: "center",
                                                fontSize: "18px",
                                                outline: "none",
                                            }}
                                        />
                                    ))}
                                </div>
                                {otpError && <p className="error-message">{otpError}</p>}
                                <button
                                    type="button"
                                    className="auth-btn"
                                    onClick={handleOtpVerification}
                                    disabled={otp.some((val) => val === "") || !password}
                                >
                                    Verify OTP & Set Password
                                </button>
                            </div>
                        )}

                    </div>

                    <div className="input-group">
                        <TextField
                            type="password"
                            label="Password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="Enter your password"
                            InputLabelProps={{shrink:'true'}}
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
                            InputLabelProps={{shrink:'true'}}
                        />
                        {submitted && !confirmPassword && (
                            <p className="error-message">Please confirm your password</p>
                        )}
                        {errors.confirmPassword && (
                            <p className="error-message">{errors.confirmPassword}</p>
                        )}  
                    </div>
                    <div className="input-group">
                        <TextField
                            type="number"
                            label="Age"
                            id="age"
                            value={age}
                            onChange={handleAgeChange}
                            placeholder="Enter you Age"
                            InputLabelProps={{shrink:'true'}}
                        />
                        {submitted && !age && (
                            <p className="error-message">Please Enter Your Age</p>
                        )}
                        {errors.age && (
                            <p className="error-message">{errors.age}</p>
                        )}
                    </div>
                    
                    <button type="submit" className="auth-btn">
                        Sign Up
                    </button>
                </form>
                <p>
                    Already have an account? <a href="/signin">Sign In</a>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;
