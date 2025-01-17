function GraphCard({ colorStart, colorEnd, title, children }) {
  return (
    <div
      className={`bg-gradient-to-br ${colorStart} ${colorEnd} rounded-xl shadow-lg p-6 flex flex-col justify-between w-full h-full`}
    >
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}

export default GraphCard;
