import { Router } from "express";
import {
  createNote,
  deleteNote,
  getNotes,
  updateNote,
} from "../controllers/noteControllers.js";
import { restrict } from "../controllers/authControllers.js";

const noteRouter = Router();

// Get And Create A Note
noteRouter.route("/").get(getNotes).post(createNote);
// Update Note And Delete Note
noteRouter.route("/:id").patch(updateNote).delete(deleteNote);

export default noteRouter;
