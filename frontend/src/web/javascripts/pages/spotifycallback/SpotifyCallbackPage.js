import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { exchangeSpotifyCodeForTokens } from "../../../apiCalls/api"; // Ensure this is the correct import

const SpotifyCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");  // Get the 'code' parameter from the URL

    if (code) {
      // Call the function to exchange the 'code' for an access token
      exchangeSpotifyCodeForTokens(code)
        .then((response) => {
          console.log("Spotify access token:", response.access_token);
          // Save the access token in local storage
          localStorage.setItem("spotifyAccessToken", response.access_token);
          // Redirect to the dashboard page after successful token exchange
          navigate("/dashboard"); // Now redirect to the dashboard
        })
        .catch((error) => {
          console.error("Error exchanging Spotify code:", error);
          // Handle any errors (e.g., show error message to the user)
        });
    } else {
      console.error("No code found in the URL");
    }
  }, [navigate]);

  return (
    <div>
      <h2>Processing Spotify login...</h2>
    </div>
  );
};

export default SpotifyCallbackPage;
