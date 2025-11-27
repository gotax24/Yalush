import { createContext, useState, useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";
import axios from "axios";

const Context = createContext();

const UserProvider = ({ children }) => {
  const [userContext, setUserContext] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useClerk();
  const SERVER = import.meta.env.VITE_SERVER_URL;
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  useEffect(() => {
    if (!userEmail) return;

    setLoading(true);
    setError(null);

    axios
      .get(`${SERVER}/users?email=${userEmail}`)
      .then((response) => {
        const user = response.data[0];
        setUserContext(user);
      })
      .catch((e) => {
        console.error(e);
        setError(e);
      })
      .finally(() => setLoading(false));
  }, [SERVER, userEmail]);

  return (
    <Context.Provider value={{ userContext, loading, error, setUserContext }}>
      {children}
    </Context.Provider>
  );
};

export { Context, UserProvider };