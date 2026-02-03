"use server";
import { connectDB } from "@/lib/connectDb";
import Auth from "@/models/authModel";
import bcrypt from "bcryptjs";
import {
  registrationSchema,
  loginSchema,
  validateData,
} from "@/lib/validationSchemas";

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

    console.log("Connecting to database...");
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

    return {
      success: true,
      message: "Account created successfully! You can now log in.",
      field: null,
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

    const user = await Auth.findOne({
      $or: [{ email }],
    });

    if (!user) {
      return {
        success: false,
        errors: {
          email: [
            "Invalid credentials. Please check your email/username and password.",
          ],
        },
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return {
        success: false,
        errors: {
          email: [
            "Invalid credentials. Please check your email/username and password.",
          ],
        },
      };
    }

    // TODO: Create session/JWT token here
    return {
      success: true,
      message: "Login successful!",
      user: {
        id: user._id,
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
