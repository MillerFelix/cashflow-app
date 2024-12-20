import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Ativa o loader
    setError(""); // Reseta os erros
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // Redireciona após login
    } catch (err) {
      setError("Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setLoading(false); // Desativa o loader
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-700 flex justify-center items-center px-4 relative">
      {/* Fundo nublado durante o carregamento */}
      {loading && <Loader />}

      <div
        className={`${
          loading ? "bg-white bg-opacity-50 backdrop-blur-md" : "bg-white"
        } p-6 rounded-xl shadow-2xl w-full max-w-sm z-10`}
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-4">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              id="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="relative">
            <input
              type="password"
              id="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-bold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          >
            Entrar
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Não tem uma conta?{" "}
          <a
            href="/register"
            className="text-green-600 hover:text-green-700 font-bold transition"
          >
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
