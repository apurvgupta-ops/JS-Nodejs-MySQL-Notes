import "./globals.css";
import { ThemeProvider } from "@/Context/ThemeContext";

export const metadata = {
  title: {
    template: "%s | Technical Agency",
    default: "Technical Agency",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
