import mongoose from "mongoose";
import { type } from "os";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
  },
  data: {
    cart: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  expires: {
    type: Number,
    default: Date.now() + 1000 * 60 * 60,
  },
});

const Session = mongoose.model("Session", sessionSchema);

export default Session;
