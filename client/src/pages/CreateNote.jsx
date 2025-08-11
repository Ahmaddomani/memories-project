import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export const CreateNote = () => {
  const [form, setForm] = useState({ title: "", content: "" });
  const [loader, setLoader] = useState(false);
  const navigator = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setForm((perv) => ({ ...perv, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoader(true);
      await axios.post(
        "http://localhost:3000/api/v1/notes/",
        {
          title: form.title,
          content: form.content,
        },
        { withCredentials: true }
      );
      Swal.fire({
        title: "success!",
        text: "The Note Has Been Saved",
        icon: "success",
      });
      navigator("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message,
      });
      setForm({ title: "", content: "" });
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f172a] to-[#1e293b] grid place-items-center px-4 text-white">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">Create New Note</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="title"
              className="block  text-gray-300 mb-4 text-xl"
            >
              Title
            </label>
            <input
              value={form.title}
              onChange={handleChange}
              type="text"
              id="title"
              name="title"
              placeholder="Note title"
              className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 outline-stone-950 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block mb-4 text-gray-300 text-xl"
            >
              Content
            </label>
            <textarea
              value={form.content}
              onChange={handleChange}
              id="content"
              name="content"
              rows="6"
              placeholder="Write your note..."
              className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-md bg-gradient-to-r from-teal-600 to-cyan-700 text-white font-semibold hover:opacity-90 transition"
          >
            {loader ? "Saving Note...." : "Save Note"}
          </button>
        </form>
      </div>
    </div>
  );
};
