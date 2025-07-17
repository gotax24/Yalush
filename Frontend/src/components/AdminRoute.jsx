import { useUser } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "./Loading";

const AdminRoute = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  // Mientras Clerk carga los datos del usuario, no renderices nada o muestra un spinner
  if (!isLoaded) {
    return <Loading />;
  }

  // Si el usuario está autenticado y tiene el rol de admin, permite el acceso
  if (isSignedIn && user.publicMetadata.role === "admin") {
    // Outlet renderizará los componentes hijos de esta ruta
    return <Outlet />;
  }
  // Si no es admin o no está autenticado, redirige a la página principal
  return <Navigate to="/" />;
};

export default AdminRoute;