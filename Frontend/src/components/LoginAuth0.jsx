import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const LoginAuth0 = () => {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

export default LoginAuth0;
