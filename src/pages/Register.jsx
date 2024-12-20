import { useState } from "react";
import { auth } from "../firebase"; // Importando o Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FiLock, FiMail } from "react-icons/fi"; // Ícones modernos

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState(""); // Estado para a mensagem de erro da senha
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setPasswordError("A senha deve ter no mínimo 6 caracteres.");
      return; // Impede o envio do formulário se a senha não atender ao requisito
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/login"); // Redireciona para login após registro
    } catch (err) {
      setError("Erro ao criar conta. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-700 flex justify-center items-center px-4">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-4">
          Crie sua Conta
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Insira seus dados para criar uma conta
        </p>
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="relative">
            <FiMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              id="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="relative">
            <FiLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              id="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}{" "}
          {/* Mensagem de erro da senha */}
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-bold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          >
            Criar Conta
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Já tem uma conta?{" "}
          <a
            href="/login"
            className="text-green-600 hover:text-green-700 font-bold transition"
          >
            Faça login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
