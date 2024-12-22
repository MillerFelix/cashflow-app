import { useState } from "react";
import { auth } from "../firebase"; // Importando o Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader";
import TextInput from "../components/common/TextInput";
import Button from "../components/common/Button";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Ativa o loader
    setError("");
    setPasswordError("");

    if (password.length < 6) {
      setPasswordError("A senha deve ter no mínimo 6 caracteres.");
      setLoading(false); // Desativa o loader se houver erro
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/login"); // Redireciona para login após registro
    } catch (err) {
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false); // Desativa o loader
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-800 flex justify-center items-center px-4 relative">
      {/* Fundo nublado durante o carregamento */}
      {loading && <Loader />}

      <div className="p-6 bg-white rounded-3xl shadow-xl w-full max-w-md transform transition hover:scale-105 hover:shadow-2xl">
        <div className="text-center mb-6">
          <img
            src="/login-image.svg"
            alt="Registro"
            className="mx-auto w-34 h-32"
          />
          <h2 className="text-4xl font-extrabold text-gray-800">
            Crie sua Conta
          </h2>
          <p className="text-gray-600 mt-2">
            Insira seus dados para criar uma conta
          </p>
        </div>
        <form onSubmit={handleRegister} className="space-y-6">
          <TextInput
            label="Email"
            value={email}
            onChange={setEmail}
            type="email"
            error={error && "Preencha um email válido"}
          />
          <TextInput
            label="Senha"
            value={password}
            onChange={setPassword}
            type="password"
            error={passwordError}
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button
            type="submit"
            bgColor="bg-gradient-to-r from-green-500 to-green-700"
            hoverColor="hover:opacity-90"
            className="text-white w-48 mx-auto block" // Adiciona centralização e largura fixa
          >
            Criar Conta
          </Button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Já tem uma conta?{" "}
          <Link
            to="/login"
            className="text-green-600 hover:text-green-700 font-bold transition"
          >
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
