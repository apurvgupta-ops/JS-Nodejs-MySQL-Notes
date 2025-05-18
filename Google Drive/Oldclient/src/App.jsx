import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Files from "./pages/Files";

const router = createBrowserRouter([
  {
    path: "/*",
    element: <Files />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
