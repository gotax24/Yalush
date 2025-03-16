import { useSignIn, useClerk } from "@clerk/clerk-react";
import { SignInButton } from "@clerk/clerk-react";
import google from "../assets/google.svg";
import tiktok from "../assets/tiktok.svg";
import facebook from "../assets/facebook.svg";
import "../css/LoginClerk.css";

const LoginClerk = () => {
  const { signIn, isLoaded } = useSignIn();
  const clerk = useClerk();

  // Manejar el envío del formulario para inicio de sesión con email/password
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!isLoaded) {
      return;
    }

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        // Redirigir o actualizar estado al iniciar sesión exitosamente
        console.log("Inicio de sesión exitoso");
        // Opcional: redirigir a la página principal
        // window.location.href = "/dashboard";
      } else {
        // Manejar inicio de sesión incompleto (podría necesitar verificación)
        console.log("El inicio de sesión necesita más pasos:", result);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <div className="wrapped">
      <div className="header-login">
        <h1 className="title">Yalush</h1>
      </div>
      <div className="center">
        <div className="container-login">
          <div className="heading">Iniciar sesión</div>
          <form onSubmit={handleSubmit} className="form">
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
              <a
                href="#"
                onClick={() => clerk.openModal({ name: "forgot_password" })}
              >
                Olvidaste la contraseña ?
              </a>
            </span>
            <input
              className="login-button"
              type="submit"
              value="Iniciar sesión"
            />
          </form>
          <div className="social-account-container">
            <span className="title">O inicia sesión con</span>
            <div className="social-accounts">
              <SignInButton mode="modal" strategy="oauth_google">
                <button className="social-button google">{google}</button>
              </SignInButton>

              <SignInButton mode="modal" strategy="oauth_tiktok">
                <button className="social-button tiktok">{tiktok}</button>
              </SignInButton>

              <SignInButton mode="modal" strategy="oauth_facebook">
                <button className="social-button facebook">{facebook}</button>
              </SignInButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginClerk;
