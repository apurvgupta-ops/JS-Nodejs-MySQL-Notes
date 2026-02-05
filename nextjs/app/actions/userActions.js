"use server";
import { connectDB } from "@/lib/connectDb";
import Auth from "@/models/authModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import {
  registrationSchema,
  loginSchema,
  validateData,
} from "@/lib/validationSchemas";
import { redirect } from "next/navigation";

export async function registerUserAction(prevState, formData) {
  try {
    const data = {
      email: formData.get("email")?.toString(),
      username: formData.get("username")?.toString(),
      password: formData.get("password")?.toString(),
    };
    console.log("Form data received:", data);
    const { email, username, password } = data;
    const validation = validateData(registrationSchema, data);
    if (!validation.success) {
      return {
        success: false,
        errors: validation.error,
      };
    }

    await connectDB();

    const existingUser = await Auth.findOne({
      $or: [{ email }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return {
          success: false,
          errors: {
            email: ["An account with this email already exists"],
          },
        };
      }
      if (existingUser.username === username) {
        return {
          success: false,
          errors: {
            username: ["This username is already taken"],
          },
        };
      }
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Auth({
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token for new user
    const token = jwt.sign(
      { id: newUser._id.toString(), email: newUser.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    );

    // Set token in cookies
    const cookieStore = await cookies();
    cookieStore.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return {
      success: true,
      message: "Account created successfully! You are now logged in.",
      field: null,
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        username: newUser.username,
      },
    };
  } catch (error) {
    console.error("Registration error:", error);

    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0];
      return {
        success: false,
        errors: {
          [Object.keys(error.errors)[0]]: [firstError.message],
        },
      };
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return {
        success: false,
        errors: {
          [field]: [`This ${field} is already registered`],
        },
      };
    }

    return {
      success: false,
      errors: {
        general: ["An unexpected error occurred. Please try again later."],
      },
    };
  }
}

export async function loginUserAction(prevState, formData) {
  try {
    const data = {
      email: formData.get("email")?.toString(),
      password: formData.get("password")?.toString(),
    };

    const validation = validateData(loginSchema, data);

    if (!validation.success) {
      return {
        success: false,
        errors: validation.error,
      };
    }

    const { email, password } = validation.data;

    await connectDB();

    const user = await Auth.findOne({ email });

    if (!user) {
      return {
        success: false,
        errors: {
          email: ["Invalid credentials. Please check your email and password."],
        },
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return {
        success: false,
        errors: {
          password: [
            "Invalid credentials. Please check your email/username and password.",
          ],
        },
      };
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    );

    // Set token in cookies
    const cookieStore = await cookies();
    cookieStore.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return {
      success: true,
      message: "Login successful!",
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
      },
    };
  } catch (error) {
    console.error("Login error:", error);

    return {
      success: false,
      errors: {
        general: ["An unexpected error occurred. Please try again later."],
      },
    };
  }
}

export async function logoutUserAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("authToken");
    cookieStore.delete("authjs.session-token");
    return {
      success: true,
      message: "Logged out successfully!",
    };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      message: "Failed to logout",
    };
  }
}
