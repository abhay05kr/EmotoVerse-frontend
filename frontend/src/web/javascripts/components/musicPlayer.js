import React, { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiPause, FiPlay } from "react-icons/fi";
import "../styles/component/musicPlayer.scss";

const MusicPlayer = ({ songs }) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    // Set the current song whenever the currentSongIndex changes
    if (songs && songs.length > 0) {
      console.log(songs);

      const newSong = songs[currentSongIndex];
      setCurrentSong(newSong);
      audioRef.current.src = newSong.url || ""; // Use preview_url if available
      audioRef.current.onended = handleNext; // Automatically go to next song when current ends
    }
  }, [currentSongIndex]);

  const handlePlayPause = () => {
    if (!currentSong?.url) {
      console.error("No audio preview available for this track");
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setIsPlaying(false);
    if (currentSongIndex < songs.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    } else {
      setCurrentSongIndex(0); // Go back to the start if at the end
    }
  };

  const handlePrevious = () => {
    setIsPlaying(false);
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
    } else {
      setCurrentSongIndex(songs.length - 1); // Go to the last song if at the start
    }
  };

  const handleSongClick = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(false); // Automatically pause so the user can choose to play
  };

  return (
    <div className="music-player">
      <div className="player-controls">
        <button onClick={handlePrevious} className="control-btn">
          <FiChevronLeft />
        </button>
        <button onClick={handlePlayPause} className="control-btn">
          {isPlaying ? <FiPause /> : <FiPlay />}
        </button>
        <button onClick={handleNext} className="control-btn">
          <FiChevronRight />
        </button>
      </div>

      {currentSong && (
        <div className="current-song">
          <strong>{currentSong.name}</strong>
          <p>{currentSong.artist}</p>
        </div>
      )}

      <ul className="song-list">
        {songs?.map((song, index) => (
          <li
            key={index}
            className={`song-item ${
              index === currentSongIndex ? "active" : ""
            }`}
            onClick={() => handleSongClick(index)}
          >
            <div className="song-info">
              <strong>{song.name}</strong> - {song.artist}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MusicPlayer;
