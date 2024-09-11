import { FolderPlus, Search, XIcon } from "lucide-react";
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
    } else if (audioRef.current.src !== playlist[currentSongIndex].audioSrc) {
      const wasPlaying = !audioRef.current.paused;
      audioRef.current.src = playlist[currentSongIndex].audioSrc;
      if (wasPlaying) {
        audioRef.current
          .play()
          .catch((error) => console.error("Playback failed", error));
      }
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

    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSongIndex, playlist]);

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

  const handleProgressBarClick = (event) => {
    const progressBar = event.target;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const progressPercentage = offsetX / progressBar.clientWidth;
    audioRef.current.currentTime = progressPercentage * duration;
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return; // Exit if no files were selected

    // Use a single AudioContext for all files
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    const newPlaylist = await Promise.all(
      files.map(async (file) => {
        let title = file.name.replace(/\.[^/.]+$/, "");
        let artist = "Unknown";
        let duration = 0;

        try {
          const arrayBuffer = await file.arrayBuffer();
          // Use async/await here to prevent blocking the main thread
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          duration = audioBuffer.duration;

          // Attempt to extract metadata from file name
          const fileNameParts = title.split("-").map((part) => part.trim());
          if (fileNameParts.length >= 2) {
            artist = fileNameParts[0];
            title = fileNameParts.slice(1).join(" ");
          }
        } catch (error) {
          console.error("Error processing audio file:", error);
        }

        return {
          title,
          artist,
          duration,
          audioSrc: URL.createObjectURL(file),
        };
      })
    );

    setPlaylist((prevPlaylist) => [...prevPlaylist, ...newPlaylist]);
  };

  const currentSong = playlist[currentSongIndex] || {
    title: "No song",
    artist: "Unknown",
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
          value={searchTerm}
          name="search"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="search"
          className="p-2  rounded-2xl placeholder:text-orange-500 text-orange-500 border border-[#EC540E] w-[95%]"
        />
        <label htmlFor="">
          {searchTerm?.length > 0 ? (
            <XIcon
              className="cursor-pointer text-[#EC540E]"
              onClick={(_) => setSearchTerm("")}
            />
          ) : (
            <Search className="cursor-pointer text-[#EC540E]" />
          )}
        </label>
      </div>

      <SongList
        searchTerm={searchTerm}
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
