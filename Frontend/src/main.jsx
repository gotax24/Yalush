import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { UserContextProvider } from "./context/UserContext.jsx";
import App from "./components/App.jsx";
import Page404 from "./components/Page404.jsx";
import Home from "./Home.jsx";
import Layout from "./components/Layout.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Layout />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  </ClerkProvider>
);
