//import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import "../css/LoginClerk.css";

const LoginAuth0 = () => {
  //const { loginWithRedirect } = useAuth0();

  return (
    <div className="wrapped">
      <div className="header-login">
        <h1 className="title">Yalush</h1>
      </div>
      <div className="center">
        <div className="container-login">
          <div className="heading">Iniciar sesión</div>
          <form action="" className="form">
            <input
              required
              className="input"
              type="email"
              name="email"
              id="email"
              placeholder="E-mail"
            />
            <input
              required
              className="input"
              type="password"
              name="password"
              id="password"
              placeholder="Password"
            />
            <span className="forgot-password">
              <a href="#">Olvidaste la contraseña ?</a>
            </span>
            <input className="login-button" type="submit" value="Sign In" />
          </form>
          <div className="social-account-container">
            <span className="title">O inicia sesión con</span>
            <div className="social-accounts">
              <button className="social-button google">
                {" "}
                {/* Botón Google */}{" "}
              </button>
              <button className="social-button apple">
                {" "}
                {/* Botón Apple */}{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAuth0;
