import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import BalanceModal from "../components/BalanceModal";
import CategoryList from "../components/CategoryList";
import Loader from "../components/Loader";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento ao buscar saldo
  const [saving, setSaving] = useState(false); // Estado para controlar o carregamento ao salvar saldo
  const userId = useAuth(); // Aqui, o useAuth agora retorna apenas o userId (UID)

  // Busca o saldo do usuário ao carregar a página
  useEffect(() => {
    const fetchBalance = async () => {
      if (userId) {
        // Verifica se há um userId válido
        try {
          setLoading(true); // Inicia o carregamento
          const userDoc = doc(db, "users", userId); // Usa o userId para buscar o saldo
          const userSnapshot = await getDoc(userDoc);
          if (userSnapshot.exists()) {
            setBalance(userSnapshot.data().balance || 0);
          }
        } catch (error) {
          console.error("Erro ao buscar saldo:", error);
        } finally {
          setLoading(false); // Finaliza o carregamento
        }
      } else {
        setLoading(false); // Finaliza o carregamento caso não haja usuário
      }
    };

    fetchBalance();
  }, [userId]); // Dependência de userId para refazer a busca quando o usuário mudar

  // Salva o novo saldo no Firebase
  const handleSaveBalance = async (newBalance) => {
    if (userId) {
      // Verifica se há um userId válido
      setSaving(true); // Inicia o carregamento ao salvar o saldo
      try {
        const userDoc = doc(db, "users", userId);
        await setDoc(userDoc, { balance: newBalance }, { merge: true });
        setBalance(newBalance);
      } catch (error) {
        console.error("Erro ao salvar saldo:", error);
      } finally {
        setSaving(false); // Finaliza o carregamento
      }
    }
  };

  // Exibe o Loader enquanto o saldo está sendo carregado ou salvo
  if (loading || saving) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />{" "}
        {/* Exibe o loader enquanto os dados são carregados ou o saldo é salvo */}
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex gap-8">
        <Card
          colorStart="from-green-500"
          colorEnd="to-green-800"
          title="Saldo atual"
          button="Atualizar Saldo"
          onButtonClick={() => setIsModalOpen(true)}
        >
          {`R$ ${balance.toFixed(2).replace(".", ",")}`}
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
