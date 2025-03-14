import React, { useState, useEffect } from 'react';
import { FiImage, FiMic, FiSend, FiTrash2 } from 'react-icons/fi';
import { getAuth } from 'firebase/auth';
import { processUserInput, fetchUserHistory } from '../../apiCalls/api';
import '../styles/component/modelInput.scss';

const ModelDataInput = () => {
    const [textInput, setTextInput] = useState('');
    const [image, setImage] = useState(null);
    const [voiceMessage, setVoiceMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    useEffect(() => {
        loadUserMessages();
    }, [userId]);

    const loadUserMessages = async () => {
        if (userId) {
            try {
                const history = await fetchUserHistory(userId);
                console.log("Fetched History:", history);
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
            saveMessage({ type: 'text', content: textInput, sender: 'user' });
            try {
                const response = await processUserInput(userId, textInput, null, null);
                updateMessages(response.text_response);
            } catch (error) {
                console.error("Text processing error:", error);
            } finally {
                setLoading(false);
                setTextInput('');
            }
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && userId) {
            setImage(file);
            saveMessage({ type: 'image', content: URL.createObjectURL(file), sender: 'user' });
            setLoading(true);

            processUserInput(userId, null, file, null)
                .then((response) => updateMessages(response.image_response))
                .catch((error) => console.error("Image processing error:", error))
                .finally(() => setLoading(false));
        }
    };

    const handleVoiceInput = () => {
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setVoiceMessage(transcript);
            saveMessage({ type: 'voice', content: transcript, sender: 'user' });

            if (userId) {
                setLoading(true);
                processUserInput(userId, transcript, null, null)
                    .then((response) => updateMessages(response.voice_response))
                    .catch((error) => console.error("Voice processing error:", error))
                    .finally(() => setLoading(false));
            }
        };

        recognition.onerror = (error) => {
            console.error("Voice recognition error:", error);
        };
    };

    const saveMessage = (message) => {
        setMessages((prev) => [...prev, message]);
    };

    const updateMessages = (botContent) => {
        saveMessage({ type: 'response', content: botContent, sender: 'bot' });
    };

    const handleClearMessages = () => {
        setMessages([]);
    };

    return (
        <div className="model-data-input">
            <h2>Feel free to share your feelings</h2>
            <div className="chat-display">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        {msg.type === 'image' ? (
                            <img src={msg.content} alt="User upload" style={{ maxWidth: '200px' }} />
                        ) : (
                            <p><strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> {msg.content}</p>
                        )}
                    </div>
                ))}
                {loading && <div className="loading">Bot is typing...</div>}
            </div>

            <div className="input-section">
                <textarea
                    value={textInput}
                    onChange={handleTextChange}
                    placeholder="Type your message..."
                />
                <button onClick={handleSendText}><FiSend /></button>
            </div>

            <div className="action-buttons">
                <label className="upload-btn">
                    <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                    <FiImage /> Upload Image
                </label>
                <button onClick={handleVoiceInput}><FiMic /> Voice Input</button>
                <button onClick={handleClearMessages}><FiTrash2 /> Clear</button>
            </div>
        </div>
    );
};

export default ModelDataInput;
