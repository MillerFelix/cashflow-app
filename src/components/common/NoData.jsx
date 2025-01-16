function NoData({
  imageSrc = "/no-data-image.svg",
  message = "Nenhum dado encontrado.",
}) {
  return (
    <div className="flex flex-col items-center mt-8">
      <img src={imageSrc} alt="Sem dados disponíveis" className="w-64 h-64" />
      <p className="text-gray-500 text-lg mt-4">{message}</p>
    </div>
  );
}

export default NoData;
