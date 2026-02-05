"use client"; // <--- important to mark this as a Client Component

import Link from "next/link";
import { usePathname } from "next/navigation"; // for checking current route
import SunIcon from "./SunIcon";
import MoonIcon from "./MoonIcon";
import { useTheme } from "@/Context/ThemeContext";
import { logoutUserAction } from "@/app/actions/userActions";
import { useRouter } from "next/navigation";
import SignIn from "./Auth/SignIn";
import SignOut from "./Auth/SignOut";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Blog", path: "/blogs" },
  { label: "Todos", path: "/todos" },
];

const authItems = [
  { label: "Login", path: "/login" },
  { label: "Register", path: "/signup" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isDark, themeToggle } = useTheme();
  const session = useSession();

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/");
    }
  }, [session]);

  const handleLogout = async () => {
    const res = await logoutUserAction();
    console.log(res);
    if (res?.success) {
      router.push("/login");
    }
  };

  return (
    <nav className="flex items-center justify-evenly p-4 dark:text-white transition">
      <ul className="flex gap-4 text-xl">
        {navItems.map(({ label, path }) => (
          <li
            key={path}
            className={`${pathname === path ? "active" : ""} bg-violet-400 dark:bg-violet-700 p-2 rounded-4xl hover:bg-violet-600 dark:hover:bg-violet-600 transition`}
          >
            <Link href={path}>{label}</Link>
          </li>
        ))}
      </ul>

      <ul className="flex gap-4 text-xl">
        {authItems.map(({ label, path }) => (
          <li
            key={path}
            className={`${pathname === path ? "active" : ""} bg-red-400 rounded-4xl p-2`}
          >
            <Link href={path}>{label}</Link>
          </li>
        ))}
      </ul>
      <button
        onClick={themeToggle}
        className="dark:bg-gray-700 dark:text-yellow-400 p-2 rounded-lg transition"
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>
      <SignIn />
      <SignOut handleLogout={handleLogout} />
      {/* <button onClick={handleLogout}>Logout</button> */}
    </nav>
  );
}
