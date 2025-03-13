import { useSignIn, useClerk } from "@clerk/clerk-react";
import { SignInButton } from "@clerk/clerk-react";
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
                <button className="social-button google">
                  <svg
                    className="svg"
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 488 512"
                  >
                    <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                  </svg>
                </button>
              </SignInButton>

              <SignInButton mode="modal" strategy="oauth_apple">
                <button className="social-button apple">
                  <svg
                    className="svg"
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 384 512"
                  >
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path>
                  </svg>
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginClerk;
