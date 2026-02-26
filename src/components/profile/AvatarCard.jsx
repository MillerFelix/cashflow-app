import React from "react";
import { FaCamera } from "react-icons/fa";

function AvatarCard({ name, email, selectedAvatar, setSelectedAvatar }) {
  const avatarList = Array.from({ length: 10 }, (_, i) => `${i + 1}.png`);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col items-center text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-600 to-indigo-900"></div>

      <div className="relative mt-8 mb-4 group cursor-pointer">
        <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 overflow-hidden relative">
          <img
            src={`/avatars/${selectedAvatar}`}
            alt="Avatar"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/150?text=USER";
            }}
          />
        </div>
        <div className="absolute bottom-0 right-2 bg-blue-600 text-white p-2 rounded-full border-2 border-white shadow-sm">
          <FaCamera size={12} />
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 truncate w-full px-2">
        {name || "Usuário"}
      </h2>
      <p className="text-xs text-gray-500 mb-4 truncate w-full px-2">{email}</p>

      <div className="w-full">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 text-left">
          Escolher Avatar
        </p>
        <div className="grid grid-cols-5 gap-2">
          {avatarList.map((av) => (
            <button
              key={av}
              type="button"
              onClick={() => setSelectedAvatar(av)}
              className={`relative aspect-square rounded-full overflow-hidden border-2 transition-all ${selectedAvatar === av ? "border-blue-600 ring-2 ring-blue-100 scale-110 z-10" : "border-transparent hover:border-gray-300"}`}
            >
              <img
                src={`/avatars/${av}`}
                alt={`Avatar ${av}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default React.memo(AvatarCard);
