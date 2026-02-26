import React from "react";
import TextInput from "../common/TextInput";
import { FaUserCircle, FaPhone } from "react-icons/fa";

function BasicInfoCard({ name, setName, phone, setPhone }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FaUserCircle className="text-blue-500" /> Dados Básicos
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextInput
          label="Nome de Exibição"
          value={name}
          onChange={setName}
          placeholder="Seu nome"
        />
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            WhatsApp (Opcional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FaPhone />
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm font-medium"
              placeholder="(00) 00000-0000"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(BasicInfoCard);
