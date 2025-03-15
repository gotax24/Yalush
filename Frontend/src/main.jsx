import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./components/App.jsx";
import Page404 from "./components/Page404.jsx";
import LoginClerk from "./components/LoginClerk.jsx";
import LoginAuth0 from "./components/LoginAuth0.jsx";
import Home from "./Home.jsx";
import "./index.css";
import Layout from "./components/Layout.jsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <Auth0Provider
    domain={AUTH0_DOMAIN}
    clientId={AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="compra" element={<Layout />} />
            <Route path="usuario" element={""} />
          </Route>
          <Route path="/loginAuth0" element={<LoginAuth0 />} />
          <Route path="/loginClerk" element={<LoginClerk />} />
          <Route path="/singIn" element={"creo que esta no es necesaria"} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  </Auth0Provider>
);
