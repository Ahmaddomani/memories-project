import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";

export const Login = () => {
  const [forms, setForms] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const ref = useRef(null);

  const navigator = useNavigate();

  const loginPost = async () => {
    const { email, password } = forms;
    try {
      setLoading(true);
      await axios.post(
        "https://memories-project-backend-0pt4.onrender.com/api/v1/users/login",
        { email, password },
        { withCredentials: true }
      );
      navigator("/");
    } catch (error) {
      setErr(error.response?.data?.message || "Login failed");
      ref.current.textContent = err;
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    ref.current.textContent = "";
    const { name, value } = e.target;
    setForms((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginPost();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] font-sans px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 text-white">
        <h1 className="text-3xl font-bold text-center mb-6 text-white drop-shadow-md">
          Welcome Back 👋
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 text-sm text-gray-300">
              Email
            </label>
            <input
              onChange={handleChange}
              required
              type="email"
              name="email"
              id="email"
              placeholder="you@example.com"
              className="rounded-md px-4 py-2 bg-white/20 focus:bg-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div className="flex flex-col relative">
            <label htmlFor="password" className="mb-1 text-sm text-gray-300">
              Password
            </label>
            <input
              onChange={handleChange}
              required
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Password"
              className="rounded-md px-4 py-2 pr-10 bg-white/20 focus:bg-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-sm text-blue-300 hover:text-blue-200"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-md bg-gradient-to-r from-blue-500 to-rose-500 text-white font-semibold hover:opacity-90 transition-all"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          ref={ref}
          className="mt-4 text-center text-sm text-red-400 animate-pulse"
        ></p>

        <p className="mt-6 text-center text-sm text-gray-300">
          Don't have an account?{" "}
          <Link to="/signup" className="underline text-blue-400">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
