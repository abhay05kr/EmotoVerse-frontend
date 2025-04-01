import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { FiImage, FiMic, FiSend, FiTrash2 } from "react-icons/fi";
import { fetchUserHistory, processUserInput } from "../../apiCalls/api";
import "../styles/component/modelInput.scss";
import MusicPlayer from "./musicPlayer";

const ModelDataInput = () => {
  const [textInput, setTextInput] = useState("");
  const [image, setImage] = useState(null);
  const [voiceMessage, setVoiceMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const [songs, setSongs] = useState([]);
  const [suggestions, setSuggestions] = useState();

  useEffect(() => {
    loadUserMessages();
  }, [userId]);

  const renderContentForCategory = () => {
    switch (selectedCategory) {
      case "songs":
        return <MusicPlayer songs={songs} />;
      // Add cases for other categories if needed
      default:
        return null;
    }
  };
  const loadUserMessages = async () => {
    if (userId) {
      try {
        const history = await fetchUserHistory(userId);
        setMessages(Array.isArray(history) ? history : []);
      } catch (error) {
        console.error("Failed to load history:", error);
        setMessages([]);
      }
    }
  };

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
  };

  const handleSendText = async () => {
    if (textInput.trim() && userId) {
      setLoading(true);
      saveMessage({ type: "text", content: textInput, sender: "user" });
      try {
        const response = await processUserInput(userId, textInput, null, null);
        updateMessages(response?.suggestions);
        setSongs(response?.songs);
        setSuggestions(response?.suggestions);
        setTextInput("");
      } catch (error) {
        console.error("Text processing error:", error);
      } finally {
        setLoading(false);
        setTextInput("");
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && userId) {
      setImage(file);
      saveMessage({
        type: "image",
        content: URL.createObjectURL(file),
        sender: "user",
      });
      setLoading(true);

      processUserInput(userId, null, file, null)
        .then((response) => updateMessages(response.image_response))
        .catch((error) => console.error("Image processing error:", error))
        .finally(() => setLoading(false));
    }
  };

  const handleVoiceInput = () => {
    if (!userId) {
      alert("User is not logged in. Please log in to use voice input.");
      return;
    }

    if (!navigator.mediaDevices) {
      alert("Your browser doesn't support audio recording.");
      return;
    }

    let chunks = [];
    let audioBlob = null;
    let recognition = null;
    let isRecognizing = false;

    // Access the microphone to record audio
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        setLoading(true);
        setVoiceMessage("Recording...");

        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          // Create a Blob from the recorded audio chunks
          audioBlob = new Blob(chunks, { type: "audio/wav" });
          const audioFile = new File([audioBlob], "voice_input.wav", {
            type: "audio/wav",
          });
          const audioUrl = URL.createObjectURL(audioBlob);

          // Save the recorded voice in chat history
          // saveMessage({
          //   type: "voice",
          //   content: audioUrl,
          //   sender: "user",
          // });

          // Call the API and send the audio to the backend after recording stops
          try {
            // Initialize Speech Recognition if not already done
            if (!isRecognizing) {
              recognition = new (window.SpeechRecognition ||
                window.webkitSpeechRecognition)();
              recognition.lang = "en-US";

              recognition.onstart = () => {
                console.log("Speech recognition started...");
                isRecognizing = true; // Set the flag to true
              };

              recognition.onresult = async (event) => {
                const transcript = event.results[0][0].transcript;
                console.log("Recognized Text:", transcript); // Log the recognized text

                // Set the recognized speech to textInput
                // Send the recognized text to the backend
                try {
                  console.log("Sending text to backend:", transcript); // Log the text sent to backend
                  const response = await processUserInput(
                    userId,
                    transcript,
                    null,
                    null
                  ); // Send text to backend API
                  if (response.text_response) {
                    saveMessage({
                      type: "voice",
                      content: audioUrl, // Display the voice recording after the API response
                      sender: "user",
                    });
                    updateMessages(response.text_response); // Show response from backend
                  } else {
                    updateMessages("Voice detected but no emotion recognized.");
                  }
                } catch (error) {
                  console.error("API error:", error);
                  updateMessages("Error processing voice input.");
                } finally {
                  setLoading(false);
                }
              };

              recognition.onerror = (error) => {
                console.error("Speech recognition error:", error);
                updateMessages("Error converting voice to text.");
              };

              recognition.start(); // Start speech recognition
            }
          } catch (error) {
            console.error("Error with speech recognition:", error);
            updateMessages("Error processing voice input.");
          }
        };

        // Auto-stop the recording after 5 seconds
        setTimeout(() => {
          mediaRecorder.stop();
          stream.getTracks().forEach((track) => track.stop());
        }, 3000);
      })
      .catch((err) => {
        console.error("Microphone error:", err);
        updateMessages("Microphone access denied or error occurred.");
      });
  };

  const saveMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const updateMessages = (botContent) => {
    saveMessage({ type: "response", content: botContent, sender: "bot" });
  };

  const handleClearMessages = () => {
    setMessages([]);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    // if (category === "songs") {
    //   return <MusicPlayer songs={songs} />;
    // }
    // Handle other categories (e.g., movies, food, etc.)
  };

  return (
    <div className="model-data-input">
      <h2>Feel free to share your feelings</h2>
      <div className="chat-display">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.type === "image" ? (
              <img
                src={msg.content}
                alt="User upload"
                style={{ maxWidth: "200px" }}
              />
            ) : msg.type === "voice" ? (
              <>
                <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong>
                <audio controls src={msg.content} />
              </>
            ) : (
              <div>
                <p className="chat-answer-para">
                  <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong>{" "}
                  {msg.content}
                </p>
                {msg.sender === "bot" && Array.isArray(suggestions) && (
                  <div className="suggestion-list">
                    {suggestions.map((suggestion, i) => (
                      <div
                        key={i}
                        className="suggestion-item"
                        onClick={() =>
                          handleCategoryClick(suggestion.toLowerCase())
                        }
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {loading && <div className="loading">Bot is typing...</div>}
      </div>
      {renderContentForCategory()}
      <div className="input-section">
        <textarea
          value={textInput}
          onChange={handleTextChange}
          placeholder="Type your message..."
        />
        <button onClick={handleSendText}>
          <FiSend />
        </button>
      </div>

      <div className="action-buttons">
        <label className="upload-btn">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
          <FiImage /> Upload Image
        </label>
        <button onClick={handleVoiceInput}>
          <FiMic /> Voice Input
        </button>
        <button onClick={handleClearMessages}>
          <FiTrash2 /> Clear
        </button>
      </div>
    </div>
  );
};

export default ModelDataInput;
