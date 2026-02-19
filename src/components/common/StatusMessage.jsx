import React from "react";

/**
 * Componente StatusMessage
 * Responsável por exibir mensagens de feedback rápido para o usuário (sucesso ou erro).
 */
function StatusMessage({ message }) {
  // Se não houver mensagem, encerra a execução e não renderiza nada na tela
  if (!message) return null;

  // Verifica dinamicamente se a mensagem é um erro para mudar as cores
  const isError = message.includes("Erro");

  return (
    <div
      className={`p-4 text-center rounded-lg my-4 ${
        isError
          ? "bg-red-200 text-red-800" // Estilo de Erro
          : "bg-green-200 text-green-800" // Estilo de Sucesso
      }`}
    >
      {message}
    </div>
  );
}

export default React.memo(StatusMessage);
