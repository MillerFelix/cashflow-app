import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
// Substituímos o updateEmail pelo verifyBeforeUpdateEmail
import { verifyBeforeUpdateEmail, updatePassword } from "firebase/auth";
import { db, auth } from "../firebase";
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

        // Pega o e-mail diretamente da instância oficial do Firebase
        if (auth.currentUser?.email) {
          setNewEmail(auth.currentUser.email);
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [userId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setErrorType("");

    try {
      // 1. Salvar os dados do perfil (Firestore)
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
      let hasAuthError = false;

      // 2. Salvar Segurança com o Objeto Oficial do Firebase
      if (showSecurity) {
        try {
          const currentUser = auth.currentUser;
          if (!currentUser) throw new Error("Sessão não encontrada.");

          if (
            newEmail &&
            newEmail.trim() !== "" &&
            newEmail.trim() !== currentUser.email
          ) {
            // Nova regra de segurança do Firebase: Exige validação do novo e-mail antes de mudar
            await verifyBeforeUpdateEmail(currentUser, newEmail.trim());
            authMessage +=
              " Um link de verificação foi enviado para o seu novo e-mail. Confirme lá para alterar.";
          }

          if (newPassword) {
            if (newPassword !== confirmPassword) {
              throw new Error("As senhas não conferem.");
            }
            if (newPassword.length < 6) {
              throw new Error("A senha deve ter pelo menos 6 caracteres.");
            }
            await updatePassword(currentUser, newPassword);
            authMessage += " Senha atualizada.";
          }
        } catch (authError) {
          hasAuthError = true;
          console.error("Erro Auth:", authError);

          let authErrorMsg = "Erro ao atualizar credenciais.";
          if (authError.code === "auth/requires-recent-login") {
            authErrorMsg =
              "Por segurança, faça logout e entre novamente para alterar e-mail ou senha.";
          } else if (authError.code === "auth/email-already-in-use") {
            authErrorMsg = "Este e-mail já está sendo usado por outra conta.";
          } else if (authError.code === "auth/invalid-email") {
            authErrorMsg = "Formato de e-mail inválido.";
          } else if (authError.message) {
            authErrorMsg = authError.message.replace(/Firebase: /g, "");
          }

          setErrorType("warning");
          setMessage(`Perfil salvo, mas a segurança falhou: ${authErrorMsg}`);
        }
      }

      // 3. Sucesso Total
      if (!hasAuthError) {
        setErrorType("success");
        setMessage(`Perfil atualizado com sucesso!${authMessage}`);
        setNewPassword("");
        setConfirmPassword("");
        if (authMessage) setShowSecurity(false);
      }
    } catch (dbError) {
      console.error("Erro ao salvar perfil:", dbError);
      setErrorType("error");
      setMessage(
        "Erro ao salvar seus dados de perfil. Verifique sua conexão e tente novamente.",
      );
    } finally {
      setSaving(false);

      // UX Aprimorado: Rola suavemente para o topo da página para o usuário ver o feedback!
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Limpa a mensagem após 8 segundos (tempo maior para lerem instruções grandes)
      setTimeout(() => setMessage(""), 8000);
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
            className={`mb-6 p-4 rounded-xl text-sm font-bold text-center border animate-fadeIn shadow-sm
              ${
                errorType === "error"
                  ? "bg-red-50 text-red-600 border-red-200"
                  : errorType === "warning"
                    ? "bg-orange-50 text-orange-700 border-orange-200"
                    : "bg-green-50 text-green-700 border-green-200"
              }`}
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
              email={auth.currentUser?.email || ""} // Email exibido agora vem direto do Firebase oficial
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
