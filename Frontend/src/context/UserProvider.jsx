import { createContext, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const { isSignedIn, user } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (isSignedIn) {
      setIsAuthenticated(true);
      setUserInfo({
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
      });
    } else {
      setIsAuthenticated(false);
      setUserInfo(null);
    }

    return { isAuthenticated, userInfo };
  }, [isSignedIn, user, userInfo, isAuthenticated]);

  return (
    <UserContext.Provider value={{ isAuthenticated, userInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
