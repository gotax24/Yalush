import { useState, useEffect, createContext } from "react";
import { useUser } from "@clerk/clerk-react";

const UserContext = createContext();

 const UserContextProvider = ({ children }) => {
  const { isSignedIn, user } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (isSignedIn) {
      setIsAuthenticated(true);
      setUserInfo({
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      });
    } else {
      setIsAuthenticated(false);
      setUserInfo(null);
    }
  }, [isSignedIn, user]);

  return (
    <UserContext.Provider value={{ isAuthenticated, userInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContextProvider, UserContext };  