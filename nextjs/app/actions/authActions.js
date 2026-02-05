"use server";

import { signIn } from "@/auth";

export async function AuthGoogleLogin() {
  await signIn("google", { redirect: "/" });
}
