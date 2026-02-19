import React from "react";
import Button from "./Button";

/**
 * Componente ActionButtons
 * Agrupa os botões padrões de "Cancelar" e "Salvar", frequentemente usados no final de formulários e modais.
 */
function ActionButtons({ onClose, onSave }) {
  return (
    <div className="flex justify-between gap-4 mt-6">
      <Button
        onClick={onClose}
        bgColor="bg-gray-200"
        hoverColor="hover:bg-gray-300"
        className="text-gray-700 w-full"
      >
        Cancelar
      </Button>

      {/* ATENÇÃO: type="submit" garante que, se estiver dentro de um <form>, 
          ele vai disparar o 'onSubmit' nativo do HTML e acionar as validações. */}
      <Button
        onClick={onSave}
        type="submit"
        bgColor="bg-green-600"
        hoverColor="hover:bg-green-700"
        className="text-gray-200 w-full"
      >
        Salvar
      </Button>
    </div>
  );
}

export default React.memo(ActionButtons);
