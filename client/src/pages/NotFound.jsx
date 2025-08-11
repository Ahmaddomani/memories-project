import { Link } from "react-router";

export const NotFound = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f172a] to-[#1e293b] grid place-items-center px-4 text-white">
      <div className="text-center max-w-md bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg">
        <h1 className="text-7xl font-bold text-rose-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-gray-300 mb-6">
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 px-6 rounded-full transition-all duration-300"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};
