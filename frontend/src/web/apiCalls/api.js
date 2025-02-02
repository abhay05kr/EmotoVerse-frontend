import axios from "axios";

// Set the base URL for your backend server (ensure this points to your Flask backend)
export const baseUrl = "http://localhost:5001/api";

// Axios default configuration
axios.defaults.baseURL = baseUrl;

// User Signup
export const userSignup = async (firstName, lastName, email, age, password) => {
    try {
        const response = await axios.post("/auth/signup", {
            firstName,
            lastName,
            email,
            age,
            password,
        });
        return response.data; // Return the response data
    } catch (error) {
        console.error("Error during signup:", error.response?.data || error.message);
        throw error.response?.data || error.message; // Throw error for handling
    }
};

// Verify OTP and Set Password
export const verifyOtpAndSetPassword = async (email, otp, password) => {
    try {
        const response = await axios.post("/auth/verify-otp", { email, otp, password });
        return response.data; // Return the response data
    } catch (error) {
        console.error("Error verifying OTP:", error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
};

// User Login
export const userLogin = async (email, password) => {
    try {
        const response = await axios.post("/auth/login", { email, password });
        return response.data; // Return the response data
    } catch (error) {
        console.error("Error during login:", error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
};

// Fetch User Details
export const fetchUserDetails = async (token) => {
    try {
        const response = await axios.get("/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Return the response data
    } catch (error) {
        console.error("Error fetching user details:", error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
};

// Delete User
export const deleteUser = async (userId, token) => {
    try {
        const response = await axios.delete(`/auth/delete-user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Return the response data
    } catch (error) {
        console.error("Error deleting user:", error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
};
