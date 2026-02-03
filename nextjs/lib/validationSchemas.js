import { z } from "zod";

// Custom password validation with detailed requirements
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    "Password must contain at least one special character",
  );

// Email validation schema
const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please provide a valid email address")
  .toLowerCase()
  .trim();

// Username validation schema
const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters long")
  .max(30, "Username cannot exceed 30 characters")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Username can only contain letters, numbers, hyphens, and underscores",
  )
  .trim();

// Registration schema
export const registrationSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
});

// Login schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email or username is required")
    .trim()
    .toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

// Helper function to format Zod errors for display
export function formatZodError(error) {
  if (!error.errors || error.errors.length === 0) {
    return { field: null, message: "Validation error" };
  }

  const firstError = error.errors[0];
  return {
    field: firstError.path[0] || null,
    message: firstError.message,
  };
}

// Helper function to validate and return formatted errors
export function validateData(schema, data) {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formatted = formatZodError(error);
      return {
        success: false,
        error: formatted.message,
        field: formatted.field,
      };
    }
    return {
      success: false,
      error: "Validation failed",
      field: null,
    };
  }
}
