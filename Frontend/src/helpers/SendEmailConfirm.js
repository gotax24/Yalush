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
    const handlePurchaseConfirmation = async () => {
      if (!userContext?.cart?.length || emailSent.current) {
        setLoading(false);
        return;
      }

      emailSent.current = true;

      try {
        const total = userContext.cart.reduce(
          (acc, product) => acc + product.price * product.quantity,
          0
        );

        await SendEmailConfirm(userContext, total);
        console.log("Correo enviado exitosamente");

        await axios.patch(
          `${import.meta.env.VITE_SERVER_URL}/users/${userContext.id}`,
          { cart: [] }
        );
        console.log("Carrito vaciado en el backend");

        setUserContext((currentUser) => ({
          ...currentUser,
          cart: [],
        }));
      } catch (err) {
        console.error("Ocurrió un error en el proceso de confirmación:", err);
        setError(
          "Hubo un problema al procesar tu confirmación: " + err.message
        );

        setUserContext((currentUser) => ({
          ...currentUser,
          cart: [],
        }));
      } finally {
        setLoading(false);
      }
    };

    if (userContext) {
      handlePurchaseConfirmation();
    }
  }, [userContext, setUserContext]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 5000);
    return () => clearTimeout(timeout);
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
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Success;
