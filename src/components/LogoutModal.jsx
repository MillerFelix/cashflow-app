const LogoutModal = ({ showModal, onClose, onLogout }) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-all ease-in-out">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Tem certeza que deseja sair?
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Você pode continuar usando o aplicativo ou fazer logout.
        </p>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
