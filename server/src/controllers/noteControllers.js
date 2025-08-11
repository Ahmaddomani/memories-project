import Note from "../models/NotesModel.js";
import { apiFeatures } from "../utils/apiFeatures.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import customError from "../utils/customError.js";

export const getNotes = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.user;
  const features = new apiFeatures(Note.find({ user: _id }), req.query)
    .filter()
    .sort()
    .paginate();

  const notes = await features.query;

  const length = notes.length;

  res.status(200).json({
    status: "success",
    length,
    data: notes,
  });
});

// Create A New Note
export const createNote = asyncErrorHandler(async (req, res, next) => {
  const { title, content } = req.body;
  const { _id } = req.user;
  const newNote = await Note.create({ title, content, user: _id });
  res.status(201).json({
    status: "success",
    data: newNote,
  });
});

// Update The Note
export const updateNote = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const updatedNote = await Note.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedNote) return next(new customError("Note Not Found", 404));

  res.status(200).json({
    status: "success",
    data: updatedNote,
  });
});

// Delete The Note
export const deleteNote = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const note = await Note.findById(id);

  //Check if the user is the owner of the Note
  if (!req.user._id.equals(note.user))
    return next(new customError("You Can't delete This One", 403));
  const deletedNote = await Note.deleteOne({ _id: id });

  if (!deletedNote) return next(new customError("Note Not Found", 404));
  res.status(200).json({
    status: "success",
    data: `The Note Has Been Deleted at ${new Date().toLocaleString()}`,
  });
});
