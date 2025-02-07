import { Outlet } from "react-router-dom";
import Container from "../components/common/Container";
import HelpModal from "../components/footer/HelpModal";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

function BasePage() {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const user = useAuth(); // Obtendo usuário logado

  useEffect(() => {
    if (!user) return; // Aguarda o usuário estar disponível

    const userId = user.uid; // Pega o ID único do usuário
    const hasVisited = localStorage.getItem(`hasVisited_${userId}`);

    if (!hasVisited) {
      localStorage.setItem(`hasVisited_${userId}`, "true");
      setShowHelpModal(true);
    }
  }, [user]); // Executa quando o usuário muda

  return (
    <Container>
      <Outlet />
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </Container>
  );
}

export default BasePage;
