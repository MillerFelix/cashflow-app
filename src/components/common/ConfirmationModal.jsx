import React from "react";
import Button from "./Button";

/**
 * Modal para confirmar ações destrutivas
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
  confirmHoverColor = "hover:bg-red-600",
  cancelBgColor = "bg-gray-200",
  cancelHoverColor = "hover:bg-gray-300",
}) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4 transition-opacity">
      <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-sm w-full animate-scaleIn">
        <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
          {description}
        </p>

        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            bgColor={cancelBgColor}
            hoverColor={cancelHoverColor}
            className="flex-1 text-gray-800 border border-gray-300 shadow-none"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            bgColor={confirmBgColor}
            hoverColor={confirmHoverColor}
            className="flex-1 text-white shadow-lg"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ConfirmationModal);
