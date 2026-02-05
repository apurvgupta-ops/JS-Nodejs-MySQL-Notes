// "use client";

import { AuthGoogleLogin } from "@/app/actions/authActions";
import React from "react";

export default function SignIn() {
  return (
    //  For custom Google Login
    <form action={AuthGoogleLogin} className="border rounded-2xl p-2">
      <button>Sign In With Google</button>
    </form>

    // Only for login google
    // <form className="border rounded-2xl p-2">
    //   <button onClick={() => signIn("google", { redirect: "/" })}>
    //     Sign In With Google
    //   </button>
    // </form>
  );
}
