import { Pause, Play } from "lucide-react";
import React from "react";

const Song = ({ song, isCurrentSong, onSelect, isPlaying, onPlayPause }) => (
  <li
    className={`py-2 px-2 hover:text-orange-600 cursor-pointer ${
      isCurrentSong
        ? "text-[#EC540E] shadow-2xl bg-[#111216] rounded-l-md rounded-r-full border-r-2 border-solid border-orange-600"
        : ""
    }`}
    onClick={onSelect}
  >
    <div className="flex justify-between items-center">
      <div>
        <p className="font-bold">{song.title}</p>
        <p className="text-sm text-gray-500">{song.artist}</p>
      </div>
      {isCurrentSong && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlayPause();
          }}
          className="bg-[#EC540E] rounded-full p-4"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white" fill="white" />
          ) : (
            <Play className="w-8 h-8 text-white" fill="white" />
          )}
        </button>
      )}
    </div>
  </li>
);

export default Song;
