import { FolderPlus, Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Controls from "./components/Controls";
import Header from "./components/Header";
import ProgressBar from "./components/ProgressBar";
import SongList from "./components/SongList";

const MusicPlayer = () => {
  const [playlist, setPlaylist] = useState([
    {
      title: "LEGENDS NEVER DIE",
      artist: "AGAINST THE CURRENT",
      audioSrc: "/songs/song1.mp3",
    },
    { title: "RAP GOD", artist: "EMINEM", audioSrc: "/songs/song2.mp3" },
    {
      title: "THE MONSTER",
      artist: "EMINEM/ RIHANNA",
      audioSrc: "/songs/song3.mp3",
    },
    { title: "LOSE YOURSELF", artist: "EMINEM", audioSrc: "/songs/song4.mp3" },
    {
      title: "ILLUSIONARY DAYTIME",
      artist: "SHIRANE",
      audioSrc: "/songs/song5.mp3",
    },
  ]);

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlaylistVisible, setIsPlaylistVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(playlist[currentSongIndex].audioSrc);
    } else {
      audioRef.current.src = playlist[currentSongIndex].audioSrc;
    }

    const audio = audioRef.current;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    const handleEnded = () => {
      playNextSong();
    };

    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", handleEnded);

    if (isPlaying) {
      audio.play().catch((error) => console.error("Playback failed", error));
    }

    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSongIndex, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = playlist[currentSongIndex].audioSrc;
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((error) => console.error("Playback failed", error));
      }
    }
  }, [currentSongIndex, playlist]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .catch((error) => console.error("Playback failed", error));
    }
    setIsPlaying(!isPlaying);
  };
  const togglePlaylistVisibility = () => {
    setIsPlaylistVisible(!isPlaylistVisible);
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
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    return `${hours > 0 ? `${hours}:` : ""}${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleProgressBarClick = (event) => {
    const progressBar = event.target;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const progressPercentage = offsetX / progressBar.clientWidth;
    audioRef.current.currentTime = progressPercentage * duration;
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newPlaylist = files.map((file) => ({
      title: file.name,
      artist: "Unknown",
      audioSrc: URL.createObjectURL(file),
    }));
    setPlaylist(newPlaylist);
    setCurrentSongIndex(0); // Reset to the first song
  };

  const currentSong = playlist[currentSongIndex] || {
    title: "No song",
    artist: "Unknown",
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredPlaylist = playlist.filter(
    (song) =>
      song.title.toLowerCase().includes(searchTerm) ||
      song.artist.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="bg-[#2C3137] text-[#999999] h-screen flex flex-col">
      {/* Header */}
      <Header title={currentSong.title} />

      {/* Album Art */}
      <div className="flex-grow flex justify-center items-center p-4">
        <img
          src="/play.svg"
          alt="Album cover"
          className="w-64 h-64 rounded-full"
        />
      </div>

      {/* Song Info */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">{currentSong.title}</h2>
        <p className="text-gray-500">{currentSong.artist}</p>
      </div>

      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        onProgressBarClick={handleProgressBarClick}
      />

      <Controls
        isPlaying={isPlaying}
        onPlayPause={togglePlay}
        onPrevious={playPreviousSong}
        onNext={playNextSong}
      />

      <div className="px-4 mb-4 flex justify-end">
        <label htmlFor="songs">
          <FolderPlus className="cursor-pointer text-[#EC540E]" />
        </label>
      </div>
      {/* File Input */}
      <div className="px-4 mb-4 flex justify-between items-center">
        <input
          type="file"
          accept="audio/*"
          name="songs"
          id="songs"
          multiple
          onChange={handleFileChange}
          className="bg-gray-700 text-gray-300 p-2 hidden"
        />
        <input
          type="text"
          id="search"
          name="search"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="search"
          className="p-2  rounded-2xl placeholder:text-orange-500 text-orange-500 border border-[#EC540E] w-[95%]"
        />
        <label htmlFor="">
          <Search className="cursor-pointer text-[#EC540E]" />
        </label>
      </div>

      <SongList
        playlist={searchTerm.length > 1 ? filteredPlaylist : playlist}
        currentSongIndex={currentSongIndex}
        onSongSelect={setCurrentSongIndex}
        isPlaying={isPlaying}
        onPlayPause={togglePlay}
        isPlaylistVisible={isPlaylistVisible}
        onTogglePlaylist={() => setIsPlaylistVisible(!isPlaylistVisible)}
      />
    </div>
  );
};

export default MusicPlayer;
