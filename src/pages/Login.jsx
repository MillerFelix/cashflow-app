import { useState, useEffect } from "react";
import { auth, db } from "../firebase"; // Importando o Firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Para buscar dados no Firestore
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader";
import TextInput from "../components/common/TextInput";
import Button from "../components/common/Button";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Buscar o nome do usuário no Firestore usando o userId (uid)
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserName(docSnap.data().name); // Salva o nome do usuário no estado
      }

      navigate("/"); // Redireciona após login
    } catch (err) {
      setError("Erro ao fazer login. Verifique suas credenciais.");
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
            alt="Login"
            className="mx-auto w-34 h-32"
          />
          <h2 className="text-4xl font-extrabold text-gray-800">
            Bem-vindo de volta, {userName ? userName : "Usuário"}!
          </h2>
          <p className="text-gray-600 mt-2">Faça login para continuar</p>
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
            className="text-white w-48 mx-auto block" // Adiciona centralização e largura fixa
          >
            Entrar
          </Button>
        </form>
        <p className="mt-6 text-center text-gray-600">
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
