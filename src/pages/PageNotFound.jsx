import React from "react";
import { Link } from "react-router-dom";

/**
 * Página 404 (Not Found)
 * Exibida quando o usuário digita uma URL que não existe no sistema.
 */
function PageNotFound() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-6">
      <img
        src="/not-found-image.svg"
        alt="Página não encontrada"
        className="w-1/2 md:w-1/3 lg:w-1/4 mb-8 drop-shadow-md"
      />
      <h2 className="text-4xl font-bold text-gray-800 mb-2">
        Oops! Algo deu errado.
      </h2>
      <p className="text-xl text-gray-600 mb-8">
        A página que você tentou acessar não foi localizada.
      </p>

      <Link
        to="/"
        className="px-8 py-4 bg-green-700 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition-all hover:-translate-y-1 active:scale-95"
      >
        Voltar para a Segurança (Dashboard)
      </Link>
    </section>
  );
}

export default React.memo(PageNotFound);
