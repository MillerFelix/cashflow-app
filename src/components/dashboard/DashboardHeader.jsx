import React from "react";
import {
  FaCalendarCheck,
  FaEyeSlash,
  FaEye,
  FaUserCog,
  FaCheckCircle,
} from "react-icons/fa";

function DashboardHeader({
  userProfile,
  todayFormatted,
  isVisible,
  setIsVisible,
  navigate,
}) {
  return (
    <>
      <div className="flex justify-between items-center px-1">
        <div
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-200 group-hover:ring-2 ring-blue-400 transition-all">
            <img
              src={`/avatars/${userProfile.avatar}`}
              alt="User"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
              Olá, {userProfile.name}
            </h1>
            <p className="text-gray-500 text-xs capitalize mt-0.5 flex items-center gap-1">
              <FaCalendarCheck size={10} /> {todayFormatted}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-200 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95"
        >
          {isVisible ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </button>
      </div>

      {!userProfile.financialFocus && (
        <div
          onClick={() => navigate("/profile")}
          className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-indigo-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="bg-indigo-200 p-2 rounded-full text-indigo-700">
              <FaUserCog />
            </div>
            <div>
              <h4 className="text-sm font-bold text-indigo-900">
                Potencialize seu Dashboard
              </h4>
              <p className="text-xs text-indigo-700">
                Configure seu perfil financeiro para receber análises
                personalizadas.
              </p>
            </div>
          </div>
          <FaCheckCircle className="text-indigo-300" />
        </div>
      )}
    </>
  );
}
export default React.memo(DashboardHeader);
