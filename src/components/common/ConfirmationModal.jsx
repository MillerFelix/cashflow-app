import React from "react";
import Button from "../common/Button";

function ConfirmationModal({
  showModal,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmButtonStyle = "bg-red-500 hover:bg-red-700",
  cancelButtonStyle = "bg-gray-300 hover:bg-gray-400 text-gray-800",
}) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{description}</p>
        <div className="flex justify-between">
          <Button
            onClick={onCancel}
            bgColor={cancelButtonStyle.split(" ")[0]}
            hoverColor={cancelButtonStyle.split(" ")[1]}
            className="text-gray-800"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            bgColor={confirmButtonStyle.split(" ")[0]}
            hoverColor={confirmButtonStyle.split(" ")[1]}
            className="text-white"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
