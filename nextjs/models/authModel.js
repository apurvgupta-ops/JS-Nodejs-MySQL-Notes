import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    password: {
      type: String,
      required: false, // Optional for OAuth users (Google login)
      minlength: [8, "Password must be at least 8 characters long"],
    },
    provider: {
      type: String,
      enum: ["google", "credentials"],
      default: "credentials",
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true },
);

const Auth = mongoose.models.Auth || mongoose.model("Auth", authSchema);
export default Auth;
