function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="w-16 h-16 border-4 border-green-500 border-t-transparent border-dashed rounded-full animate-spin"></div>
    </div>
  );
}

export default Loader;
