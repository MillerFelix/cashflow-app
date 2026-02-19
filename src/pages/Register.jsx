import React, { useState, useCallback } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader";
import TextInput from "../components/common/TextInput";
import Button from "../components/common/Button";
import StatusMessage from "../components/common/StatusMessage";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // useCallback: Memoriza a função de registro
  const handleRegister = useCallback(
    async (e) => {
      e.preventDefault();

      // 1. Limpa os erros atuais
      setError("");
      setPasswordError("");
      setSuccessMessage("");

      // 2. Valida ANTES de chamar o Loader
      if (password.length < 6) {
        setPasswordError("A senha deve ter no mínimo 6 caracteres.");
        return;
      }

      if (password !== confirmPassword) {
        setPasswordError("As senhas não coincidem.");
        return;
      }

      // 3. Tudo válido? Agora sim, mostramos o Loader
      setLoading(true);

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const user = userCredential.user;

        // Salva o nome do usuário no banco de dados
        await setDoc(doc(db, "users", user.uid), { name });

        setSuccessMessage("Conta criada com sucesso!");
        setTimeout(() => navigate("/login"), 2000);
      } catch (err) {
        setError("Erro ao criar conta. Tente novamente.");
      } finally {
        setLoading(false);
      }
    },
    [email, password, confirmPassword, name, navigate],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-800 flex justify-center items-center px-4 relative">
      {loading && <Loader />}
      <div className="p-2 sm:p-6 bg-white rounded-3xl shadow-xl w-full max-w-md sm:max-w-lg max-h-screen overflow-auto">
        <div className="text-center mb-4 sm:mb-6">
          <img
            src="/login-image.svg"
            alt="Registro"
            className="mx-auto w-16 sm:w-32 md:w-36 lg:w-40"
          />
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-800 mb-2 mt-2">
            Crie sua Conta
          </h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Insira seus dados para criar uma conta
          </p>
        </div>

        {successMessage && (
          <StatusMessage type="success" message={successMessage} />
        )}
        {error && <StatusMessage type="error" message={error} />}

        <form onSubmit={handleRegister} className="space-y-4 sm:space-y-6">
          <TextInput
            label="Nome"
            value={name}
            onChange={setName}
            type="text"
            className="w-full"
          />
          <TextInput
            label="Email"
            value={email}
            onChange={setEmail}
            type="email"
            className="w-full"
          />
          <TextInput
            label="Senha"
            value={password}
            onChange={setPassword}
            type="password"
            error={passwordError}
            className="w-full"
          />
          <TextInput
            label="Confirmar Senha"
            value={confirmPassword}
            onChange={setConfirmPassword}
            type="password"
            error={passwordError}
            className="w-full"
          />

          <Button
            type="submit"
            bgColor="bg-gradient-to-r from-green-500 to-green-700"
            hoverColor="hover:opacity-90"
            className="text-white w-48 mx-auto block"
          >
            Criar Conta
          </Button>
        </form>

        <p className="mt-4 sm:mt-6 text-center text-gray-600 text-sm sm:text-base">
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
