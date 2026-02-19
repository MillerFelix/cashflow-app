import React from "react";

/**
 * Componente NoData
 * Utilizado para exibir um visual amigável quando uma lista está vazia (ex: sem transações).
 * Recebe uma imagem e uma mensagem que possuem valores padrão, mas podem ser sobrescritos.
 */
function NoData({
  imageSrc = "/no-data-image.svg", // Imagem padrão caso não seja informada
  message = "Nenhum dado encontrado.", // Mensagem padrão caso não seja informada
}) {
  return (
    <div className="flex flex-col items-center mt-8">
      <img src={imageSrc} alt="Sem dados disponíveis" className="w-64 h-64" />
      <p className="text-gray-500 text-lg mt-4">{message}</p>
    </div>
  );
}

export default React.memo(NoData);
