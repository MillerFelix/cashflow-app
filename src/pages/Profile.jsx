import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateEmail, updatePassword } from "firebase/auth";
import { db } from "../firebase";
import Button from "../components/common/Button";
import TextInput from "../components/common/TextInput";
import Loader from "../components/common/Loader";
import StatusMessage from "../components/common/StatusMessage";
import {
  FaUserCircle,
  FaSave,
  FaCamera,
  FaPhone,
  FaArrowLeft,
  FaBriefcase,
  FaCalendarAlt,
  FaLock,
  FaEnvelope,
  FaChevronDown,
  FaChevronUp,
  FaPlusCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Profile() {
  const user = useAuth();
  const userId = user?.uid;
  const navigate = useNavigate();

  // Dados Básicos
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("1.png");

  // Dados Estratégicos
  const [workModel, setWorkModel] = useState("clt");
  const [payDay, setPayDay] = useState(""); // Pagamento Principal
  const [payDay2, setPayDay2] = useState(""); // Adiantamento (Novo)
  const [financialFocus, setFinancialFocus] = useState("control");

  // Dados de Segurança
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSecurity, setShowSecurity] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorType, setErrorType] = useState("");

  const avatarList = Array.from({ length: 10 }, (_, i) => `${i + 1}.png`);

  useEffect(() => {
    async function fetchProfile() {
      if (userId) {
        try {
          const docRef = doc(db, "users", userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setName(data.name || "");
            setPhone(data.phone || "");
            if (data.avatar) setSelectedAvatar(data.avatar);

            setWorkModel(data.workModel || "clt");
            setPayDay(data.payDay || "");
            setPayDay2(data.payDay2 || ""); // Carregar o segundo dia
            setFinancialFocus(data.financialFocus || "control");
          }
          if (user?.email) setNewEmail(user.email);
        } catch (error) {
          console.error("Erro ao carregar perfil:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchProfile();
  }, [userId, user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setErrorType("");

    try {
      const docRef = doc(db, "users", userId);
      await updateDoc(docRef, {
        name,
        phone,
        avatar: selectedAvatar,
        workModel,
        payDay: parseInt(payDay) || 1,
        payDay2: payDay2 ? parseInt(payDay2) : null, // Salva ou remove
        financialFocus,
      });

      let authMessage = "";

      if (showSecurity) {
        if (newEmail !== user.email) {
          await updateEmail(user, newEmail);
          authMessage += " E-mail atualizado.";
        }
        if (newPassword) {
          if (newPassword !== confirmPassword)
            throw new Error("As senhas não conferem.");
          if (newPassword.length < 6)
            throw new Error("A senha deve ter pelo menos 6 caracteres.");
          await updatePassword(user, newPassword);
          authMessage += " Senha atualizada.";
        }
      }

      setErrorType("success");
      setMessage(`Dados salvos com sucesso!${authMessage}`);
      setNewPassword("");
      setConfirmPassword("");
      if (authMessage) setShowSecurity(false);
      setTimeout(() => setMessage(""), 4000);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setErrorType("error");
      if (error.code === "auth/requires-recent-login")
        setMessage("Para alterar senha/email, faça logout e entre novamente.");
      else if (error.code === "auth/email-already-in-use")
        setMessage("Este e-mail já está em uso.");
      else setMessage(error.message || "Erro ao salvar alterações.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen font-sans text-gray-800 pb-20">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-bold bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200"
        >
          <FaArrowLeft /> Voltar ao Dashboard
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Meu Perfil
            </h1>
            <p className="text-gray-500 text-sm">
              Gerencie sua identidade e preferências.
            </p>
          </div>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm font-bold text-center border animate-fadeIn ${errorType === "error" ? "bg-red-50 text-red-600 border-red-200" : "bg-green-50 text-green-700 border-green-200"}`}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={handleSave}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* IDENTIDADE */}
          <div className="lg:col-span-1 flex flex-col gap-6">
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
                      e.target.src =
                        "https://via.placeholder.com/150?text=USER";
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
              <p className="text-xs text-gray-500 mb-4 truncate w-full px-2">
                {user.email}
              </p>

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
                        alt="Av"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* DADOS */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* DADOS PESSOAIS */}
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

            {/* PERFIL FINANCEIRO - ATUALIZADO */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border-l-4 border-indigo-500">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <FaBriefcase className="text-indigo-500" /> Perfil Financeiro
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Informações para calibrar as dicas financeiras.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Modelo de Renda
                  </label>
                  <select
                    value={workModel}
                    onChange={(e) => setWorkModel(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none text-sm font-bold text-gray-700"
                  >
                    <option value="clt">CLT (Salário Fixo)</option>
                    <option value="publico">Funcionário Público</option>
                    <option value="pj">PJ / Contrato</option>
                    <option value="autonomo">Autônomo / Variável</option>
                    <option value="estudante">Estudante / Mesada</option>
                  </select>
                </div>

                {/* LOGICA DE DOIS PAGAMENTOS */}
                <div className="sm:col-span-2 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Quando o dinheiro cai?
                  </label>
                  <div className="flex gap-4 items-start">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-indigo-700 mb-1 block">
                        Dia Principal
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <FaCalendarAlt />
                        </div>
                        <input
                          type="number"
                          min="1"
                          max="31"
                          value={payDay}
                          onChange={(e) => setPayDay(e.target.value)}
                          className="w-full pl-10 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-100 outline-none text-sm font-bold"
                          placeholder="Ex: 5"
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-indigo-700 mb-1 block">
                        Adiantamento / Vale (Opcional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <FaCalendarAlt />
                        </div>
                        <input
                          type="number"
                          min="1"
                          max="31"
                          value={payDay2}
                          onChange={(e) => setPayDay2(e.target.value)}
                          className="w-full pl-10 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-100 outline-none text-sm font-bold"
                          placeholder="Ex: 20"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2">
                    Preencha o segundo dia se você recebe quinzenalmente (Ex:
                    dia 5 e dia 20).
                  </p>
                </div>

                <div className="sm:col-span-2 mt-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Foco Atual
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "control", label: "Controle", icon: "📊" },
                      { id: "debt", label: "Sair das Dívidas", icon: "🆘" },
                      { id: "save", label: "Reserva", icon: "🛡️" },
                      { id: "invest", label: "Investir", icon: "🚀" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFinancialFocus(opt.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${financialFocus === opt.id ? "bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500" : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"}`}
                      >
                        <span className="text-xl mb-1">{opt.icon}</span>
                        <span className="text-xs font-bold">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SEGURANÇA */}
            <div
              className={`bg-white rounded-3xl shadow-sm border transition-all duration-300 overflow-hidden ${showSecurity ? "border-red-200" : "border-gray-200 hover:border-gray-300"}`}
            >
              <button
                type="button"
                onClick={() => setShowSecurity(!showSecurity)}
                className="w-full p-6 flex justify-between items-center text-left focus:outline-none"
              >
                <div className="flex items-center gap-2">
                  <FaLock
                    className={showSecurity ? "text-red-500" : "text-gray-400"}
                  />
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
                      ⚠️ Atenção: Alterar esses dados pode exigir que você faça
                      login novamente.
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

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={saving}
                className="bg-gray-900 hover:bg-black text-white px-8 py-3 shadow-lg flex items-center gap-2"
              >
                {saving ? (
                  <Loader size="small" color="white" />
                ) : (
                  <>
                    <FaSave /> Salvar Perfil
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
