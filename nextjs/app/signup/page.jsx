"use client";

import { useActionState, useState } from "react";
import { registerUserAction } from "@/app/actions/userActions";
import { registrationSchema } from "@/lib/validationSchemas";
import z from "zod";

export default function Signup() {
  const [state, formAction, isPending] = useActionState(registerUserAction, {
    success: false,
    errors: {},
  });
  const [clientErrors, setClientErrors] = useState({});

  const clientAction = async (formData) => {
    setClientErrors({});

    const data = Object.fromEntries(formData);
    const result = registrationSchema.safeParse(data);

    if (!result.success) {
      setClientErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    formAction(formData);
  };
  console.log(state);
  const errors =
    Object.keys(clientErrors).length > 0 ? clientErrors : state.errors;

  console.log(errors);

  return (
    <form action={clientAction} className="flex flex-col gap-4">
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

      <div>
        <input
          name="username"
          placeholder="Username"
          disabled={isPending}
          defaultValue="helolo" // ✅ Default Value
        />
        {errors?.username && (
          <p className="text-red-500 text-sm">{errors.username}</p>
        )}
      </div>

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

      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-500 text-white p-2"
      >
        {isPending ? "Validating..." : "Register"}
      </button>

      {state.success && (
        <p className="text-green-500">Account created successfully!</p>
      )}
    </form>
  );
}
