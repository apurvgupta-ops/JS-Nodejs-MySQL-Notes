import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Files from "./pages/Files";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Files/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
