import React from "react";
import { FaLock, FaChevronUp, FaChevronDown, FaEnvelope } from "react-icons/fa";

function SecurityCard({
  showSecurity,
  setShowSecurity,
  newEmail,
  setNewEmail,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
}) {
  return (
    <div
      className={`bg-white rounded-3xl shadow-sm border transition-all duration-300 overflow-hidden ${showSecurity ? "border-red-200" : "border-gray-200 hover:border-gray-300"}`}
    >
      <button
        type="button"
        onClick={() => setShowSecurity(!showSecurity)}
        className="w-full p-6 flex justify-between items-center text-left focus:outline-none"
      >
        <div className="flex items-center gap-2">
          <FaLock className={showSecurity ? "text-red-500" : "text-gray-400"} />
          <h3
            className={`text-lg font-bold ${showSecurity ? "text-gray-900" : "text-gray-500"}`}
          >
            Segurança da Conta
          </h3>
        </div>
        {showSecurity ? (
          <FaChevronUp className="text-gray-400" />
        ) : (
          <FaChevronDown className="text-gray-400" />
        )}
      </button>

      {showSecurity && (
        <div className="px-6 pb-6 pt-0 animate-fadeIn">
          <div className="border-t border-gray-100 pt-4 grid grid-cols-1 gap-4">
            <p className="text-xs text-red-500 bg-red-50 p-2 rounded mb-2">
              ⚠️ Atenção: Alterar esses dados pode exigir que você faça login
              novamente.
            </p>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Alterar E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  autoComplete="off"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full pl-10 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-100 outline-none text-sm"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Nova Senha
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-100 outline-none text-sm"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-100 outline-none text-sm"
                  placeholder="Repita a senha"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(SecurityCard);
