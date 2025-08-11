import { Link } from "react-router";

export const Unauthorized = () => {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#0f172a] to-[#1e293b] grid place-items-center text-white px-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 shadow-2xl text-center">
        <h1 className="text-3xl font-bold mb-4">Unauthorized Access 401</h1>
        <p className="mb-6 text-gray-300">
          You must be logged in to view this page. Please login or sign up to
          continue.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="w-full sm:w-auto px-6 py-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold hover:opacity-90 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="w-full sm:w-auto px-6 py-2 rounded-md bg-gradient-to-r from-rose-600 to-rose-800 text-white font-semibold hover:opacity-90 transition"
          >
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
};
