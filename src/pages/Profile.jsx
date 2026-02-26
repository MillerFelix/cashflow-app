import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateEmail, updatePassword } from "firebase/auth";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";

import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { FaArrowLeft, FaSave } from "react-icons/fa";

// Componentes da Página
import AvatarCard from "../components/profile/AvatarCard";
import BasicInfoCard from "../components/profile/BasicInfoCard";
import FinancialProfileCard from "../components/profile/FinancialProfileCard";
import SecurityCard from "../components/profile/SecurityCard";

function Profile() {
  const user = useAuth();
  const userId = user?.uid;
  const navigate = useNavigate();

  // Estados dos Dados
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("1.png");
  const [workModel, setWorkModel] = useState("clt");
  const [payDay, setPayDay] = useState("");
  const [payDay2, setPayDay2] = useState("");
  const [financialFocus, setFinancialFocus] = useState("control");

  // Estados de Segurança
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSecurity, setShowSecurity] = useState(false);

  // Estados de Tela
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorType, setErrorType] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      if (!userId) return;
      try {
        const docSnap = await getDoc(doc(db, "users", userId));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setPhone(data.phone || "");
          if (data.avatar) setSelectedAvatar(data.avatar);
          setWorkModel(data.workModel || "clt");
          setPayDay(data.payDay || "");
          setPayDay2(data.payDay2 || "");
          setFinancialFocus(data.financialFocus || "control");
        }
        if (user?.email) setNewEmail(user.email);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
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
      await updateDoc(doc(db, "users", userId), {
        name,
        phone,
        avatar: selectedAvatar,
        workModel,
        payDay: parseInt(payDay) || 1,
        payDay2: payDay2 ? parseInt(payDay2) : null,
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

        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-500 text-sm">
            Gerencie sua identidade e preferências.
          </p>
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
            <AvatarCard
              name={name}
              email={user?.email}
              selectedAvatar={selectedAvatar}
              setSelectedAvatar={setSelectedAvatar}
            />
          </div>

          {/* DADOS */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <BasicInfoCard
              name={name}
              setName={setName}
              phone={phone}
              setPhone={setPhone}
            />

            <FinancialProfileCard
              workModel={workModel}
              setWorkModel={setWorkModel}
              payDay={payDay}
              setPayDay={setPayDay}
              payDay2={payDay2}
              setPayDay2={setPayDay2}
              financialFocus={financialFocus}
              setFinancialFocus={setFinancialFocus}
            />

            <SecurityCard
              showSecurity={showSecurity}
              setShowSecurity={setShowSecurity}
              newEmail={newEmail}
              setNewEmail={setNewEmail}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
            />

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
