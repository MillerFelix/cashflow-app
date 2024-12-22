function Card({
  colorStart,
  colorEnd,
  title,
  button,
  children,
  onButtonClick,
}) {
  return (
    <div
      className={`bg-gradient-to-br ${colorStart} ${colorEnd} rounded-xl shadow-lg p-8 flex flex-col justify-between w-full sm:w-1/2 lg:w-1/3`}
    >
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="mt-4">
        <p className="text-3xl font-semibold text-yellow-300">{children}</p>
      </div>
      <button
        onClick={onButtonClick}
        className="mt-4 px-4 py-2 bg-yellow-400 text-white hover:bg-yellow-500 rounded-lg"
      >
        {button}
      </button>
    </div>
  );
}

export default Card;
