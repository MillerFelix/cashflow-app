function ProgressBar({ type, currentValue, goalValue }) {
  const progressPercentage = Math.min((currentValue / goalValue) * 100, 100);
  const isComplete = progressPercentage === 100;

  return (
    <div className="relative h-8 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
      <div className="absolute top-0 left-0 h-full w-full bg-gray-300" />
      <div
        className={`absolute top-0 left-0 h-full transition-all duration-300 ${
          type === "expense"
            ? "bg-gradient-to-r from-red-600 via-red-800 to-red-900"
            : "bg-gradient-to-r from-emerald-300 via-emerald-500 to-green-700"
        }`}
        style={{ width: `${progressPercentage}%` }}
      />
      <span
        className={`relative font-semibold text-xs sm:text-sm md:text-base lg:text-lg whitespace-nowrap px-2 ${
          isComplete
            ? "text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-yellow-400 animate-pulse"
            : "text-white"
        }`}
      >
        {isComplete
          ? type === "expense"
            ? "Limite atingido!"
            : "Meta batida!"
          : `${Math.round(progressPercentage)}%`}
      </span>
    </div>
  );
}

export default ProgressBar;
