import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { UserProvider } from "./context/UserContext.jsx";
import Home from "./Home.jsx";
import App from "./components/App.jsx";
import Page404 from "./components/Page404.jsx";
import Layout from "./components/Layout.jsx";
import ProductPage from "./components/ProductPage.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import FavPage from "./components/FavPage.jsx";
import Cart from "./components/Cart.jsx";
import Success from "./components/Success.jsx";
import Contact from "./components/Contact.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="/products" element={<App />}>
              <Route index element={<Layout />} />
              <Route path=":id" element={<ProductPage />} />
            </Route>
            <Route path="cart" element={<Cart />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="favorite" element={<FavPage />} />
            <Route path="/success" element={<Success />} />
            <Route path="/contactos" element={<Contact />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </ClerkProvider>
);
