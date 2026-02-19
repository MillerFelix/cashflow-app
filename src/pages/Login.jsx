import React, { useState, useCallback } from "react";
import { auth } from "../firebase"; // 'db' e 'doc' removidos, pois não são mais necessários aqui
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader";
import TextInput from "../components/common/TextInput";
import Button from "../components/common/Button";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Estado 'userName' removido: ele era definido mas nunca usado antes da navegação
  const navigate = useNavigate();

  // useCallback: Memoriza a função de login
  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
        // Fazemos o login
        await signInWithEmailAndPassword(auth, email, password);

        // Removida a busca desnecessária ao Firestore aqui. O useAuth cuidará disso.

        // Redireciona imediatamente, tornando o login mais veloz
        navigate("/");
      } catch (err) {
        setError("Erro ao fazer login. Verifique suas credenciais.");
      } finally {
        setLoading(false);
      }
    },
    [email, password, navigate],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-800 flex justify-center items-center px-4 relative">
      {loading && <Loader />}

      <div className="p-6 bg-white rounded-3xl shadow-xl w-full max-w-lg sm:max-w-md lg:max-w-lg xl:max-w-xl transform transition hover:scale-105 hover:shadow-2xl">
        <div className="text-center mb-6">
          <img
            src="/login-image.svg"
            alt="Login"
            className="mx-auto w-24 sm:w-32 md:w-36 lg:w-40"
          />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2 mt-2">
            Bem-vindo de volta!
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
          <TextInput
            label="Senha"
            value={password}
            onChange={setPassword}
            type="password"
            error={error && "Digite sua senha corretamente"}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
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
    </div>
  );
}

export default Login;
