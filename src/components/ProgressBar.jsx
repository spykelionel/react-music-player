const ProgressBar = ({ currentTime, duration, onProgressBarClick }) => {
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    return `${hours > 0 ? `${hours}:` : ""}${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="px-4 mb-4">
      <div
        className="bg-gray-700 h-1 rounded-full relative cursor-pointer"
        onClick={onProgressBarClick}
      >
        <div
          className="bg-[#EC540E] h-1 rounded-full"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        ></div>
        <div
          className="absolute top-1/2 h-5 w-5 left-[-10px] transform -translate-y-1/2 bg-orange-600 text-white text-xs px-2 py-1 rounded-full"
          style={{ left: `${(currentTime / duration) * 100}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-sm mt-1">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
