import { Outlet } from "react-router-dom";
import Container from "../components/common/Container";
import HelpModal from "../components/footer/HelpModal";
import { useEffect, useState } from "react";

function BasePage() {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");

    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem("hasVisited", "true");

      setTimeout(() => {
        setShowHelpModal(true);
      }, 500); // Pequeno delay para evitar travamento na renderização inicial
    }
  }, []);

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
