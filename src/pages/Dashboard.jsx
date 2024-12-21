import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import BalanceModal from "../components/BalanceModal";
import CategoryList from "../components/CategoryList";
import Loader from "../components/Loader";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importando os ícones do olhinho

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true); // Estado para controlar a visibilidade do saldo
  const userId = useAuth();

  // Busca o saldo do usuário ao carregar a página
  useEffect(() => {
    const fetchBalance = async () => {
      if (userId) {
        try {
          setLoading(true);
          const userDoc = doc(db, "users", userId);
          const userSnapshot = await getDoc(userDoc);
          if (userSnapshot.exists()) {
            setBalance(userSnapshot.data().balance || 0);
          }
        } catch (error) {
          console.error("Erro ao buscar saldo:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [userId]);

  // Salva o novo saldo no Firebase
  const handleSaveBalance = async (newBalance) => {
    if (userId) {
      setSaving(true);
      try {
        const userDoc = doc(db, "users", userId);
        await setDoc(userDoc, { balance: newBalance }, { merge: true });
        setBalance(newBalance);
      } catch (error) {
        console.error("Erro ao salvar saldo:", error);
      } finally {
        setSaving(false);
      }
    }
  };

  // Formatação do saldo com separação de milhar
  const formattedBalance = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(balance);

  // Exibe o Loader enquanto o saldo está sendo carregado ou salvo
  if (loading || saving) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex gap-8 flex-wrap justify-center md:justify-start relative">
        <Card
          colorStart="from-green-500"
          colorEnd="to-green-800"
          title="Saldo atual"
          button="Atualizar Saldo"
          onButtonClick={() => setIsModalOpen(true)}
        >
          <div className="flex items-center justify-between">
            <p className="text-3xl font-semibold text-yellow-300">
              {isBalanceVisible ? formattedBalance : "••••••••"}
            </p>
            <button
              onClick={() => setIsBalanceVisible(!isBalanceVisible)}
              className="text-yellow-300 text-2xl"
            >
              {isBalanceVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </Card>
      </div>
      {isModalOpen && (
        <BalanceModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveBalance}
          initialBalance={(balance * 100).toString()}
        />
      )}
      <CategoryList />
    </div>
  );
}

export default Dashboard;
