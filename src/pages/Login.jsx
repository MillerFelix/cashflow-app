import React, { useState, useCallback } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader";
import TextInput from "../components/common/TextInput";
import Button from "../components/common/Button";
import {
  FaTimes,
  FaLock,
  FaEnvelope,
  FaExclamationTriangle,
} from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados para o Modal de Recuperação
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");

  const navigate = useNavigate();

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/");
      } catch (err) {
        setError("Erro ao fazer login. Verifique suas credenciais.");
      } finally {
        setLoading(false);
      }
    },
    [email, password, navigate],
  );

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetError("Por favor, digite seu e-mail.");
      return;
    }
    setResetLoading(true);
    setResetError("");
    setResetMessage("");

    try {
      // Configuração para tentar forçar o idioma (depende do suporte do Firebase no cliente)
      auth.languageCode = "pt";

      await sendPasswordResetEmail(auth, resetEmail);

      setResetMessage(
        "E-mail enviado! Verifique sua caixa de entrada e a pasta de SPAM/Lixo Eletrônico.",
      );
      setResetEmail("");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setResetError("E-mail não encontrado.");
      } else if (err.code === "auth/invalid-email") {
        setResetError("E-mail inválido.");
      } else {
        setResetError("Erro ao enviar e-mail. Tente novamente.");
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-800 flex justify-center items-center px-4 relative">
      {loading && <Loader />}

      <div className="p-6 bg-white rounded-3xl shadow-xl w-full max-w-lg sm:max-w-md lg:max-w-lg xl:max-w-xl transform transition hover:scale-105 hover:shadow-2xl">
        <div className="text-center mb-6">
          <img
            src="/login-image.png"
            alt="Login"
            className="mx-auto w-24 sm:w-32 md:w-36 lg:w-40"
          />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2 mt-2">
            Bem-vindo ao{" "}
            <span className="bg-gradient-to-r from-green-400 via-green-500 to-green-800 bg-clip-text text-transparent">
              Cash$Flow!
            </span>
          </h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Faça login para continuar
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <TextInput
            label="Email"
            value={email}
            onChange={setEmail}
            type="email"
            error={error && "Preencha um email válido"}
          />

          <div>
            <TextInput
              label="Senha"
              value={password}
              onChange={setPassword}
              type="password"
              error={error && "Digite sua senha corretamente"}
            />
            <div className="text-right mt-1">
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setShowResetModal(true);
                  setResetError("");
                  setResetMessage("");
                }}
                className="text-xs text-green-600 hover:text-green-800 font-bold hover:underline transition-colors"
              >
                Esqueceu sua senha?
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button
            type="submit"
            bgColor="bg-gradient-to-r from-green-500 to-green-700"
            hoverColor="hover:opacity-90"
            className="text-white w-48 mx-auto block"
          >
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm sm:text-base">
          Não tem uma conta?{" "}
          <Link
            to="/register"
            className="text-green-600 hover:text-green-700 font-bold transition"
          >
            Cadastre-se
          </Link>
        </p>
      </div>

      {/* MODAL DE RECUPERAÇÃO */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative animate-scaleIn">
            <button
              onClick={() => setShowResetModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes size={18} />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 text-lg">
                <FaLock />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Recuperar Senha
              </h3>
              <p className="text-xs text-gray-500 mt-1 px-4">
                Digite seu e-mail para receber o link de redefinição.
              </p>
            </div>

            <form
              onSubmit={handleResetPassword}
              className="flex flex-col gap-4"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full pl-10 p-3 rounded-xl border border-gray-200 focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none text-sm"
                  placeholder="exemplo@email.com"
                />
              </div>

              {resetError && (
                <p className="text-red-500 text-xs font-bold text-center">
                  {resetError}
                </p>
              )}

              {resetMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-700 text-xs font-bold text-center flex flex-col gap-1">
                    <span>{resetMessage}</span>
                    <span className="text-[10px] text-green-600 font-normal flex items-center justify-center gap-1">
                      <FaExclamationTriangle size={10} /> O e-mail pode estar no
                      Spam!
                    </span>
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={resetLoading || !!resetMessage}
                className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:opacity-90 text-white py-2.5 rounded-xl font-bold text-sm"
              >
                {resetLoading ? (
                  <Loader size="small" color="white" />
                ) : (
                  "Enviar Link"
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
