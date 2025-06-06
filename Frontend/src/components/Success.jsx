import { Context } from "../context/UserContext";
import { useContext } from "react";

const Success = () => {
  const { userContext } = useContext(Context);
  const name = userContext?.name || "Usuario";

  return (
    <>
      <div>
        <h1>¡Pago exitoso!</h1>
        <h2>Muchas gracias por su compra {name}</h2>
        <p>Se envio un correo a su email con la confirmacion de su compra</p>
      </div>
    </>
  );
};

export default Success;
