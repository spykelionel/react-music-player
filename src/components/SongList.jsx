import { ChevronDown, ChevronUp, Heart } from "lucide-react";
import React from "react";
import Song from "./Song";

const SongList = ({
  playlist,
  currentSongIndex,
  onSongSelect,
  isPlaying,
  onPlayPause,
  isPlaylistVisible,
  onTogglePlaylist,
}) => (
  <div className="bg-[#30353D] rounded-t-3xl p-4">
    <div className="flex justify-between items-center mb-4 transition-transform duration-300 ease-in-out">
      {isPlaylistVisible ? (
        <ChevronDown
          className="cursor-pointer w-6 h-6"
          onClick={onTogglePlaylist}
        />
      ) : (
        <ChevronUp
          className="cursor-pointer w-6 h-6 "
          onClick={onTogglePlaylist}
        />
      )}
      <span className="font-bold">Up Next</span>
      <Heart className="w-6 h-6" />
    </div>
    {isPlaylistVisible && (
      <ul>
        {playlist.map((song, index) => (
          <Song
            key={index}
            song={song}
            isCurrentSong={index === currentSongIndex}
            onSelect={() => onSongSelect(index)}
            isPlaying={isPlaying && index === currentSongIndex}
            onPlayPause={onPlayPause}
          />
        ))}
      </ul>
    )}
  </div>
);

export default SongList;
