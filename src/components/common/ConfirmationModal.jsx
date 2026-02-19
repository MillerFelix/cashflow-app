import React from "react";
import Button from "./Button";

/**
 * Componente ConfirmationModal
 * Modal genérico usado para confirmar ações destrutivas ou importantes (ex: Excluir Transação).
 * Ele trava a tela do usuário até que ele tome uma decisão (Confirmar ou Cancelar).
 */
function ConfirmationModal({
  showModal,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmBgColor = "bg-red-500",
  confirmHoverColor = "hover:bg-red-700",
  cancelBgColor = "bg-gray-300",
  cancelHoverColor = "hover:bg-gray-400",
}) {
  // Retorna nulo (não desenha nada) se o modal não deve ser exibido
  if (!showModal) return null;

  return (
    // Overlay escuro com z-index alto para ficar por cima da página
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{description}</p>

        <div className="flex justify-between">
          <Button
            onClick={onCancel}
            bgColor={cancelBgColor}
            hoverColor={cancelHoverColor}
            className="text-gray-800"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            bgColor={confirmBgColor}
            hoverColor={confirmHoverColor}
            className="text-white"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ConfirmationModal);
