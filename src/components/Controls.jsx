import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import React from "react";

const Controls = ({ isPlaying, onPlayPause, onPrevious, onNext }) => (
  <div className="flex justify-center items-center space-x-8 mb-8">
    <button onClick={onPrevious}>
      <SkipBack className="w-8 h-8 box-shadow cursor-pointer" />
    </button>
    <button
      onClick={onPlayPause}
      className="bg-[#EC540E] rounded-full p-4 box-shadow cursor-pointer"
    >
      {isPlaying ? (
        <Pause className="w-8 h-8 text-white" fill="white" />
      ) : (
        <Play className="w-8 h-8 text-white" fill="white" />
      )}
    </button>
    <button onClick={onNext}>
      <SkipForward className="w-8 h-8 box-shadow cursor-pointer" />
    </button>
  </div>
);

export default Controls;
