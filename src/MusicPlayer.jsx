import {
  ChevronDown,
  ChevronLeft,
  Heart,
  MoreVertical,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const MusicPlayer = () => {
  const [playlist, setPlaylist] = useState([
    {
      title: "LEGENDS NEVER DIE",
      artist: "AGAINST THE CURRENT",
      audioSrc: "/songs/song1.mp3",
    },
    {
      title: "RAP GOD",
      artist: "EMINEM",
      audioSrc: "/songs/song2.mp3",
    },
    {
      title: "THE MONSTER",
      artist: "EMINEM/ RIHANNA",
      audioSrc: "/songs/song3.mp3",
    },
    {
      title: "LOSE YOURSELF",
      artist: "EMINEM",
      audioSrc: "/songs/song4.mp3",
    },
    {
      title: "ILLUSIONARY DAYTIME",
      artist: "SHIRANE",
      audioSrc: "/songs/song5.mp3",
    },
  ]);

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(new Audio(playlist[currentSongIndex].audioSrc));

  useEffect(() => {
    const audio = audioRef.current;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    // Add event listeners
    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);

    // Play audio if isPlaying is true
    if (isPlaying) audio.play();

    return () => {
      // Remove event listeners
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
    };
  }, [isPlaying]);

  useEffect(() => {
    audioRef.current.src = playlist[currentSongIndex].audioSrc;
    if (isPlaying) audioRef.current.play();
  }, [currentSongIndex, playlist]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNextSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  const playPreviousSong = () => {
    setCurrentSongIndex(
      (prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length
    );
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Seek function
  const handleSeek = (e) => {
    const progressBar = e.target;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const seekTime = (offsetX / rect.width) * duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const currentSong = playlist[currentSongIndex];

  return (
    <div className="bg-slate-900 text-gray-300 h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <ChevronLeft className="w-6 h-6" />
        <h1 className="text-lg font-bold">{currentSong.title}</h1>
        <MoreVertical className="w-6 h-6" />
      </div>

      {/* Album Art */}
      <div className="flex-grow flex justify-center items-center p-4">
        <img
          src="/api/placeholder/300/300"
          alt="Album cover"
          className="w-64 h-64 rounded-full border border-orange-500"
        />
      </div>

      {/* Song Info */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">{currentSong.title}</h2>
        <p className="text-gray-500">{currentSong.artist}</p>
      </div>

      {/* Progress Bar with Seek */}
      <div className="px-4 mb-4">
        <div
          className="bg-gray-700 h-1 rounded-full cursor-pointer"
          onClick={handleSeek}
        >
          <div
            className="bg-orange-500 h-1 rounded-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center space-x-8 mb-8">
        <button onClick={playPreviousSong}>
          <SkipBack className="w-8 h-8" />
        </button>
        <button onClick={togglePlay} className="bg-orange-500 rounded-full p-4">
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white" fill="white" />
          ) : (
            <Play className="w-8 h-8 text-white" fill="white" />
          )}
        </button>
        <button onClick={playNextSong}>
          <SkipForward className="w-8 h-8" />
        </button>
      </div>

      {/* Playlist */}
      <div className="bg-slate-800 rounded-t-3xl p-4">
        <div className="flex justify-between items-center mb-4">
          <ChevronDown className="w-6 h-6" />
          <span className="font-bold">Up Next</span>
          <Heart className="w-6 h-6" />
        </div>
        <ul>
          {playlist.map((song, index) => (
            <li
              key={index}
              className={`py-2 ${
                index === currentSongIndex ? "text-orange-500" : ""
              }`}
              onClick={() => setCurrentSongIndex(index)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{song.title}</p>
                  <p className="text-sm text-gray-500">{song.artist}</p>
                </div>
                {index === currentSongIndex && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MusicPlayer;
