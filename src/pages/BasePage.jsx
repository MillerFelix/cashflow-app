import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Container from "../components/common/Container";
import HelpModal from "../components/footer/HelpModal";
import { useAuth } from "../hooks/useAuth";

/**
 * Componente BasePage
 * Atua como o "invólucro" central da área logada do sistema.
 * Ele renderiza o Container (com Navbar e Footer) e a página atual no <Outlet />.
 * Também controla a exibição do Modal de Ajuda na primeira vez que o usuário entra.
 */
function BasePage() {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const user = useAuth();

  useEffect(() => {
    if (!user) return;

    const userId = user.uid;
    // Usar o ID do usuário no localStorage garante que se outro usuário logar
    // no mesmo navegador, ele também verá o tutorial inicial.
    const hasVisited = localStorage.getItem(`hasVisited_${userId}`);

    if (!hasVisited) {
      localStorage.setItem(`hasVisited_${userId}`, "true");
      setShowHelpModal(true);
    }
  }, [user]);

  return (
    <Container>
      {/* O Outlet é onde as páginas filhas (Dashboard, Metas, Transações) são renderizadas */}
      <Outlet />

      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </Container>
  );
}

export default BasePage;
