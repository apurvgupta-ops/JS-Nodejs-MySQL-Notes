import React from "react";

export default function ApplicationLayout({ children }) {
  return (
    <main>
      <header style={{ background: "red" }}>
        This is the header (Application)
      </header>
      Application layout <div>{children}</div>
      <footer style={{ background: "blue" }}>
        This is the footer (Application)
      </footer>
    </main>
  );
}
