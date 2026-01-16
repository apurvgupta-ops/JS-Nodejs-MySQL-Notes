import React from "react";

export default function MarketingLayout({ children }) {
  return (
    <main>
                <header style={{ background: "red" }}>This is the header (Marketing)</header>

      Marketing layout <div>{children}</div>
              <footer style={{ background: "blue" }}>This is the footer (Marketing)</footer>

    </main>
  );
}
