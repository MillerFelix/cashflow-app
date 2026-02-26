import React from "react";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";

/**
 * Componente Container
 * Serve como o "esqueleto" ou layout principal da aplicação.
 * Ele garante que a Navbar fique no topo, o Footer na base, e o conteúdo no meio.
 */
function Container({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">{children}</main>

      <Footer />
    </div>
  );
}

export default React.memo(Container);
