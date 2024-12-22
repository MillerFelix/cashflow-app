function StatusMessage({ message }) {
  if (!message) return null;

  return (
    <div
      className={`p-4 text-center rounded-lg mt-4 ${
        message.includes("Erro")
          ? "bg-red-200 text-red-800"
          : "bg-green-200 text-green-800"
      }`}
    >
      {message}
    </div>
  );
}

export default StatusMessage;
