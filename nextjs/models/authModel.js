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
    image: {
      type: String,
    },
    username: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      // required: false, // Optional for OAuth users (Google login)
      // minlength: [8, "Password must be at least 8 characters long"],
    },
    // provider: {
    //   type: String,
    //   enum: ["google", "credentials"],
    //   default: "google",
    // },
    // googleId: {
    //   type: String,
    //   unique: true,
    //   sparse: true,
    // },
  },
  { timestamps: true },
);

const Auth = mongoose.models.Auth || mongoose.model("Auth", authSchema);
export default Auth;
