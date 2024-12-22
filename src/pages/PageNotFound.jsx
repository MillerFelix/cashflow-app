import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <section className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-6">
      <img
        src="/not-found-image.svg"
        alt="Página não encontrada"
        className="w-1/3 md:w-1/4 mb-6"
      />
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">
        Algo deu errado!
      </h2>
      <div className="flex flex-col items-center">
        <strong className="text-xl text-gray-700">
          Página não Localizada!
        </strong>
      </div>
      <div className="mt-6">
        <Link
          to="/"
          className="px-6 py-3 bg-green-700 text-white rounded-lg shadow hover:bg-green-600 transition"
        >
          Voltar para a Página Inicial
        </Link>
      </div>
    </section>
  );
}

export default PageNotFound;
