import axios from "axios";

export const baseUrl = "http://localhost:5001/";

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
    console.error(
      "Error during signup:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message; // Throw error for handling
  }
};
export const verifyOtpAndSetPassword = async (
  firstName,
  lastName,
  email,
  firebaseUID
) => {
  try {
    const response = await axios.post("/verify-otp", {
      firstName,
      lastName,
      email,
      firebaseUID,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error verifying OTP:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

// User Login
export const userLogin = async (idToken) => {
  try {
    const response = await axios.post("/login", { idToken });
    return response.data;
  } catch (error) {
    console.error("Error during login:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
export const fetchUserDetails = async (token) => {
  try {
    const response = await axios.get("/fetchdata", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user details:",
      error.response?.data || error.message
    );
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
    console.error(
      "Error deleting user:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

// api for ai
export const processUserInput = async (userId, text, image, voice) => {
  const formData = new FormData();
  formData.append("userId", userId);
  if (text) formData.append("text", text);
  if (image) formData.append("image", image);
  if (voice) formData.append("voice", voice);

  try {
    const response = await axios.post("/recommendation/process", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error processing input:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

export const fetchUserHistory = async (userId) => {
  try {
    const response = await axios.get(
      `/recommendation/chat-history?userId=${userId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching history:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

export const getSpotifyLoginUrl = async () => {
  try {
    const response = await axios.get("/spotify-login");
    // Assuming the response contains { "auth_url": "https://accounts.spotify.com/authorize..." }
    return response.data.auth_url;
  } catch (error) {
    console.error(
      "Error getting Spotify login URL:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

export const exchangeSpotifyCodeForTokens = async (code) => {
    try {
      const response = await axios.get(`/spotify-callback?code=${code}`);
      // Assuming the response contains access_token, refresh_token, and expires_in
      localStorage.setItem('spotifyAccessToken', response.data.access_token);
      return response.data;
    } catch (error) {
      console.error("Error exchanging code for tokens:", error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  };
  
  
