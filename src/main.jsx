import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./components/App.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={""} />
        <Route path="productos" element={""} />
        <Route path="usuario" element={""} />
      </Route>
      <Route path="/login" element={""} />
      <Route path="/singIn" element={""} />
      <Route path="*" element={""} />
    </Routes>
  </BrowserRouter>
);
