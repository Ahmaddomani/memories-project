import Navbar from "./Navbar";
import { Loader } from "../components/common/Loader";
import { Unauthorized } from "../pages/errors/Unauthorized";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router";

export const Home = () => {
  const [error, setError] = useState(null);
  const [loader, setLoader] = useState(true);
  const [notes, setNotes] = useState({ status: false, data: [] });
  const [doneLoadingId, setDoneLoadingId] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", content: "" });
  const [editError, setEditError] = useState(null);
  const noteTitle = useRef(null);
  const editPopup = useRef(null);

  // {handle Change Function}
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setEditForm((perv) => ({ ...perv, [name]: value }));
  };

  // {handle Submit Function}
  const submitFunc = async (id) => {
    try {
      console.log(editForm);
      const response = await axios.patch(
        `https://memories-project-backend-0pt4.onrender.com/api/v1/notes/${id}`,
        editForm,
        { withCredentials: true }
      );
      console.log(response);
      editPopup.current.className += " hidden ";
      fetchNotes();
    } catch (error) {
      console.log(error.response.data.message);
      setEditError(error.response.data.message);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(
        `https://memories-project-backend-0pt4.onrender.com/api/v1/notes/${id}`,
        {
          withCredentials: true,
        }
      );
      setNotes((prev) => ({
        ...prev,
        data: prev.data.filter((note) => note._id !== id),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const doneFunc = async (id) => {
    try {
      setDoneLoadingId(id);
      await axios.patch(
        `https://memories-project-backend-0pt4.onrender.com/api/v1/notes/${id}`,
        { Done: true },
        { withCredentials: true }
      );
      setNotes((prev) => ({
        ...prev,
        data: prev.data.map((note) =>
          note._id === id ? { ...note, Done: true } : note
        ),
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setDoneLoadingId(null);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.get(
        "https://memories-project-backend-0pt4.onrender.com/api/v1/notes",
        {
          withCredentials: true,
        }
      );

      if (response.data.length > 0) {
        setTimeout(() => {
          console.log(notes);
          setNotes((prev) => ({ ...prev, status: true }));
        }, 2000);

        setNotes((prev) => ({ ...prev, data: response.data.data }));
      }
      setLoader(false);
    } catch (error) {
      if (error.message === "Network Error") setError("Network Error");
      if (error.response.status === 401) setError("Unauthorized");
      else setError("Server Error");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  if (error === "Unauthorized") return <Unauthorized />;
  if (error === "Network Error") {
    return (
      <div className="h-screen grid place-items-center text-3xl">
        Network Error
      </div>
    );
  }

  if (loader) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      {/* Popup Overlay */}
      <form
        ref={editPopup}
        className="fixed hidden inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
      >
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 text-white relative">
          {/* Close Button*/}
          <button
            onClick={(e) => {
              e.preventDefault();
              editPopup.current.className += " hidden ";
              const [input, textarea, p] =
                editPopup.current.querySelectorAll("input, textarea,p");
              p.textContent = "";
              input.value = "";
              textarea.value = "";
            }}
            className="absolute top-3 right-4 text-gray-300 hover:text-white text-xl"
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold mb-6 text-center drop-shadow-md">
            Edit Note
          </h2>

          {/* Fields */}
          <div className="flex flex-col mb-4">
            <label className="mb-1 text-sm text-gray-300">Title</label>
            <input
              onChange={handleChange}
              name="title"
              type="text"
              placeholder="Note title"
              className="rounded-md px-4 py-2 bg-white/20 focus:bg-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div className="flex flex-col mb-6">
            <label className="mb-1 text-sm text-gray-300">Description</label>
            <textarea
              onChange={handleChange}
              name="content"
              placeholder="Note description"
              className="rounded-md px-4 py-2 bg-white/20 focus:bg-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none h-28"
            ></textarea>
          </div>

          {/* Buttons*/}
          <div className="flex justify-end gap-3">
            <button
              onClick={(e) => {
                editPopup.current.className += " hidden ";
                e.preventDefault();
              }}
              className="px-5 py-2 rounded-md bg-gray-400/30 text-white hover:bg-gray-400/50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                submitFunc(editPopup.current.id);
              }}
              className="px-5 py-2 rounded-md bg-gradient-to-r from-blue-500 to-rose-500 text-white font-semibold hover:opacity-90 transition"
            >
              Save
            </button>
          </div>
          {/* Error Viewer */}
          <p className="text-center w-full text-rose-500 mt-3 ">
            {editError || ""}
          </p>
        </div>
      </form>

      <Navbar />
      {notes.data.length > 0 ? (
        <div className="content px-4 py-6 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
          {!notes.status
            ? Array(6)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-white/10 backdrop-blur-md p-6 space-y-3 shadow-md"
                  >
                    <Skeleton
                      height={20}
                      width={"60%"}
                      baseColor="#334155"
                      highlightColor="#475569"
                    />
                    <Skeleton
                      count={3}
                      baseColor="#334155"
                      highlightColor="#475569"
                    />
                    <Skeleton
                      height={30}
                      width={"30%"}
                      baseColor="#334155"
                      highlightColor="#475569"
                    />
                  </div>
                ))
            : notes.data.map((note) => (
                <div
                  className="rounded-xl bg-white/10 backdrop-blur-md p-6 shadow-md space-y-4 relative"
                  key={note._id}
                >
                  <div className="head flex justify-between items-center m-0">
                    <h2
                      ref={noteTitle}
                      className={`text-xl m-0 font-semibold text-white ${
                        note.Done && "line-through"
                      }`}
                    >
                      {note.title}
                    </h2>
                    {!note.Done && (
                      <svg
                        onClick={() => {
                          editPopup.current.className =
                            editPopup.current.className
                              .split(" ")
                              .filter((cln) => cln !== "hidden")
                              .join(" ");
                          // Add The Note ID To the Popup
                          editPopup.current.id = note._id;
                          // Select The inputs From Popups
                          const [input, textarea] =
                            editPopup.current.querySelectorAll(
                              "input, textarea"
                            );
                          editForm.title = note.title;
                          editForm.content = note.content;
                          input.value = note.title;
                          textarea.value = note.content;
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className={`size-6 hover:text-teal-700 duration-200 cursor-pointer ${
                          note.Done && "hidden"
                        }`}
                      >
                        <title>Edit</title>
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                        />
                      </svg>
                    )}
                  </div>
                  <p className="text-gray-300">{note.content}</p>

                  {/*The Buttons */}
                  <div className="flex justify-between">
                    <button
                      onClick={() => doneFunc(note._id)}
                      className={`px-4 py-2  bg-green-600 text-white rounded-md hover:bg-green-800 hover:text-white transition ${
                        note?.Done && "hidden"
                      }`}
                    >
                      {doneLoadingId === note._id ? "Done..." : "Done"}
                    </button>
                    <button
                      onClick={() => deleteNote(note._id)}
                      className={`px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-800 hover:text-white transition ${
                        note.Done && "w-full"
                      }`}
                    >
                      {note.Done ? "Delete" : "Cancel"}
                    </button>
                  </div>
                </div>
              ))}
        </div>
      ) : (
        <div className="w-full h-[calc(100vh-72px)] grid place-items-center px-4">
          <div className="text-center max-w-md bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-md">
            <h1 className="text-2xl font-semibold text-white mb-4">
              You Don't Have Any Notes Yet
            </h1>
            <Link
              to="/createNote"
              className="inline-block mt-3 bg-slate-900 hover:bg-teal-800 text-white px-5 py-2 rounded-md transition"
            >
              <div className="flex items-center gap-2 justify-center">
                <span className="text-xl">＋</span>
                <span>New Note</span>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
