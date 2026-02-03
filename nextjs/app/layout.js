import Header from "@/Components/Header";
import "./globals.css";
import { ThemeProvider } from "@/Context/ThemeContext";
import { cookies } from "next/headers";

export const metadata = {
  title: {
    template: "%s | Technical Agency",
    default: "Technical Agency",
  },
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value;
  const isDark = theme === "dark";
  return (
    <html lang="en" className={isDark ? "dark" : ""} suppressHydrationWarning>
      <body>
        <ThemeProvider initialTheme={isDark}>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
