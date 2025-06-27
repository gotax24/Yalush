import { Context } from "../context/UserContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Success.css";

const Success = () => {
  const { userContext } = useContext(Context);
  const name = userContext?.name || "Usuario";
  const navigate = useNavigate();

 useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 3000);
    return () => clearTimeout(timeout); // Limpia el timeout si el componente se desmonta
  }, [navigate]);


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
    </div>
  );
};

export default Success;
