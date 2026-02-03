"use client";
import React, { useActionState } from "react";
import Link from "next/link";
import { loginUserAction } from "../actions/userActions";
import { loginSchema } from "@/lib/validationSchemas";
import z from "zod";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginUserAction, {
    success: false,
    errors: {},
  });
  const [clientErrors, setClientErrors] = React.useState({});

  const clientAction = async (formData) => {
    setClientErrors({});

    const data = Object.fromEntries(formData);
    const result = loginSchema.safeParse(data);

    if (!result.success) {
      console.log(result);
      setClientErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    formAction(formData);

    if (state.success) {
      router.push("/todos");
    }
  };
  const errors =
    Object.keys(clientErrors).length > 0 ? clientErrors : state.errors;

  return (
    <div>
      <h1>Login Page</h1>
      <form action={clientAction}>
        <div>
          <input
            name="email"
            placeholder="Email"
            disabled={isPending}
            defaultValue="admin@gmail.com" // ✅ Default Value
          />
          {errors?.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>
        <br />
        <div>
          <input
            name="password"
            type="password"
            placeholder="Password"
            disabled={isPending}
            defaultValue="password123Hello$" // ✅ Default Value
          />
          {errors?.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>
        <br />
        {state.message && <p className="text-green-500">{state.message}</p>}
        <button type="submit" disabled={isPending}>
          Login
        </button>
      </form>
      <p>
        Don't have an account? <Link href="/register">Register here</Link>
      </p>
    </div>
  );
}
