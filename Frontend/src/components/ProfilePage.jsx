import { useEffect, useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import axios from "axios";
import Loading from "./Loading";

const ProfilePage = () => {
  const { user } = useClerk();
  const SERVER = import.meta.env.SERVER_URL;
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
        profileImageUrl: user.profileImageUrl,
        admin: false,
      };

      try {
        // Verifica si el usuario ya existe en la base de datos
        const response = await axios.get(`${SERVER}/users?clerkId=${user.id}`);
        const existingUser = response.data;

        if (existingUser.length === 0) {
          // Si no existe, crea un nuevo usuario
          await axios.post(`${SERVER}/users`, userToSave);
          setLoading(false);
        } else {
          // Si ya existe, actualiza los datos del usuario
          await axios.put(`${SERVER}/users/${existingUser[0].id}`, userToSave);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error guardando el usuario en la base de datos:", error);
        setLoading(false);
      }
    };

    saveUserToDatabase();
  }, [user, SERVER]);

  if (!user) return <div>Inicia sesión para ver tu perfil</div>;
  if (loading) return <Loading />;

  return (
    <div>
      <h1>Perfil de Usuario</h1>
      <img src={user.profileImageUrl} alt="Foto de perfil" />
      <p>
        Nombre: {user.firstName} {user.lastName}
      </p>
      <p>Email: {user.emailAddresses[0].emailAddress}</p>
    </div>
  );
};

export default ProfilePage;
