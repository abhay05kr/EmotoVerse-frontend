import axios from "axios";

export const baseUrl = "http://localhost:5001/api";

axios.defaults.baseURL = baseUrl;

export const userSignup = async (firstName, lastName, email, password) => {
    try {
        const response = await axios.post("/auth/signup", {
            firstName,
            lastName,
            email,
            password,
        });
        return response.data; // Return the response data
    } catch (error) {
        console.error("Error during signup:", error.response?.data || error.message);
        throw error.response?.data || error.message; // Throw error for handling
    }
};
export const verifyOtpAndSetPassword = async (firstName,lastName,email,firebaseUID) => {
    try {
        const response = await axios.post("/auth/verify-otp", { firstName,lastName,email,firebaseUID });
        return response.data;
    } catch (error) {
        console.error("Error verifying OTP:", error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
};

// User Login
export const userLogin = async (idToken) => {
    try {
        const response = await axios.post("/auth/login", { idToken });
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