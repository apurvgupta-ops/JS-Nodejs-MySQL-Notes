import mongoose from "mongoose";

export const Todo =
  mongoose.models.Todo ||
  mongoose.model("Todo", {
    title: {
      type: String,
      required: true,
    },

    completed: {
      type: Boolean,
      default: false,
      required: true,
    },
  });
