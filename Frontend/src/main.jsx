import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./components/App.jsx";
import Page404 from "./components/Page404.jsx";
import Login from "./components/Login.jsx";
import SingUp from "./components/SingUp.jsx";
import Home from "./Home.jsx";
import Layout from "./components/Layout.jsx";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="compra" element={<Layout />} />
          <Route path="usuario" element={""} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/singUp" element={<SingUp />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  </ClerkProvider>
);
