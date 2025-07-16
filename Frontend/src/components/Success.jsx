import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/UserContext";
import { SendEmailConfirm } from "../helpers/SendEmailConfirm.js";
import axios from "axios";
import Loading from "../components/Loading.jsx";
import "../css/Success.css";

const Success = () => {
  const { userContext, setUserContext } = useContext(Context);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const emailSent = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Cuando el contexto esté listo, quitamos el "loading"
    if (userContext) {
      setLoading(false);
    }

    // Enviar solo si hay carrito y no se ha enviado aún
    if (
      userContext &&
      userContext.cart &&
      userContext.cart.length > 0 &&
      !emailSent.current
    ) {
      emailSent.current = true;

      const total = userContext.cart.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0
      );

      SendEmailConfirm(userContext, total)
        .then((response) => {
          // Vacía el carrito en el backend (json-server)
          console.log("Correo enviado exitosamente:", response);
          axios
            .patch(
              `${import.meta.env.VITE_SERVER_URL}/users/${userContext.id}`,
              { cart: [] }
            )
            .then(() => {
              console.log("Carrito vaciado en el backend");
              // Actualiza el contexto del usuario para reflejar el carrito vacío
              setUserContext({
                ...userContext,
                cart: [],
              });
            })
            .catch((err) => {
              console.error("Error vaciando carrito en backend", err);
              setUserContext({
                ...userContext,
                cart: [],
              });
            });
        })
        .catch((error) => {
          setError("El correo no se pudo enviar: " + error.message);
        });
    }
  }, [userContext, setUserContext]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 5000); // Aumenté a 5 segundos para dar tiempo a leer
    return () => clearTimeout(timeout); // Limpia el timeout si el componente se desmonta
  }, [navigate]);

  if (loading) return <Loading />;

  const name = userContext?.name || "Usuario";

  return (
    <div className="success-container">
      <div className="success-card">
        <h1 className="title-success">¡Pago exitoso!</h1>
        <h2 className="sub-title-success">Gracias por tu compra, {name} 🎉</h2>
        <p className="p-success">
          Hemos enviado un correo de confirmación a tu dirección registrada.
        </p>
        <button className="button-success" onClick={() => navigate("/")}>
          Volver al inicio
        </button>
      </div>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Success;
