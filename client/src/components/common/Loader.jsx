export const Loader = () => {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#0f172a] to-[#1e293b] grid place-items-center text-white px-4">
      <div className="flex flex-col items-center gap-4">
        <span className="block w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></span>
        <h2 className="text-xl font-semibold tracking-widest">Loading...</h2>
      </div>
    </div>
  );
};
