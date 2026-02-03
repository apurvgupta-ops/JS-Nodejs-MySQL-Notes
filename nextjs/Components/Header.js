"use client"; // <--- important to mark this as a Client Component

import Link from "next/link";
import { usePathname } from "next/navigation"; // for checking current route
import SunIcon from "./SunIcon";
import MoonIcon from "./MoonIcon";
import { useTheme } from "@/Context/ThemeContext";

const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Todos", path: "/todos" },
];

const authItems = [
  { label: "Login", path: "/login" },
  { label: "Register", path: "/signup" },
];

export default function Header() {
  const pathname = usePathname();
  const { isDark, themeToggle } = useTheme();
  return (
    <nav className="flex items-center justify-evenly mt-10">
      <ul className="flex gap-4 text-xl">
        {navItems.map(({ label, path }) => (
          <li
            key={path}
            className={`nav-item ${pathname === path ? "active" : ""} bg-violet-400 p-2 rounded-[20px] hover:bg-violet-600 transition`}
          >
            <Link href={path}>{label}</Link>
          </li>
        ))}
      </ul>

      <ul className="flex gap-4 text-xl">
        {authItems.map(({ label, path }) => (
          <li
            key={path}
            className={`nav-item ${pathname === path ? "active" : ""} `}
          >
            <Link href={path}>{label}</Link>
          </li>
        ))}
      </ul>
      <button onClick={themeToggle}>
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>
    </nav>
  );
}
