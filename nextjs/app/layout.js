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
        <header style={{ background: "red" }}>This is the header</header>
        {children}
        <footer style={{ background: "blue" }}>This is the footer</footer>
      </body>
    </html>
  );
}
