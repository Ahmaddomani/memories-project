import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title Is Required"],
      unique: true,
      maxlength: [25, "Maximum length For Title is 25 characters"],
    },
    content: {
      type: String,
      required: [true, "Content Is Required"],
      minlength: [5, "Content must be at least 10 characters long"],
      maxlength: [25, "Maximum length For content is 50 characters"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Done: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true } // add CreatedAT and UpdatedAT Automatic
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
