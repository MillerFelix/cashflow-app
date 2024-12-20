import Button from "./Button";

function ActionButtons({ onClose, onSave }) {
  return (
    <div className="flex justify-end space-x-2">
      <Button
        onClick={onClose}
        bgColor="bg-gray-200"
        hoverColor="hover:bg-gray-300"
        className="text-gray-700"
      >
        Cancelar
      </Button>
      <Button
        onClick={onSave}
        bgColor="bg-green-600"
        hoverColor="hover:bg-green-700"
        className="text-gray-200"
      >
        Salvar
      </Button>
    </div>
  );
}

export default ActionButtons;
