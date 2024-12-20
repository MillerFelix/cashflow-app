import Button from "./Button";

/* eslint-disable react/prop-types */
function InfoCard({ colorStart, colorEnd, title, button, children }) {
  return (
    <div
      className={`bg-gradient-to-br ${colorStart} ${colorEnd} rounded-xl shadow-lg p-8 flex flex-col justify-between w-1/3`}
    >
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="mt-4">
        <p className="text-3xl font-semibold text-yellow-300">{children}</p>
      </div>
      <Button bgColor="bg-yellow-400" hoverColor="hover:bg-yellow-500">
        {button}
      </Button>
    </div>
  );
}
/* eslint-enable react/prop-types */

export default InfoCard;
