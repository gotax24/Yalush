import { useEffect, useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import axios from "axios";
import Loading from "./Loading";
import "../css/ProfilePage.css";

const ProfilePage = () => {
  const { user } = useClerk();
  const SERVER = import.meta.env.VITE_SERVER_URL;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saveUserToDatabase = async () => {
      if (!user) return;
      setLoading(true);
      const userToSave = {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.imageUrl,
        favotites: [],
        cart: [],
      };

      try {
        // Se Verifica si el usuario ya existe en la base de datos
        const response = await axios.get(`${SERVER}/users?clerkId=${user.id}`);
        const existingUser = response.data || [];

        if (existingUser.length === 0) {
          // Si no existe, crea un nuevo usuario
          await axios.post(`${SERVER}/users`, userToSave);
          setLoading(false);
        } else {
          // Si ya existe, actualiza los datos del usuario
          if (existingUser.length === 0) {
            await axios.post(`${SERVER}/users`, userToSave);
          } else {
            await axios.patch(
              `${SERVER}/users/${existingUser[0].id}`,
              userToSave
            );
          }

          setLoading(false);
        }
      } catch (error) {
        console.error("Error guardando el usuario en la base de datos:", error);
        setLoading(false);
      }
    };

    saveUserToDatabase();
  }, [user, SERVER]);

  if (loading || !user) return <Loading />;

  return (
    <>
      <div className="profile-page">
        <h1 className="title-perfil">Perfil de Usuario</h1>
        <img className="img-perfil" src={user.imageUrl} alt="Foto de perfil" />
        <p className="text-perfil">
          Nombre: {user.firstName} {user.lastName}
        </p>
        <p className="text-perfil">
          Email: {user.emailAddresses[0].emailAddress}
        </p>
      </div>
    </>
  );
};

export default ProfilePage;
