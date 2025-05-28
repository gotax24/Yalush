import { Context } from "../context/UserContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { dateNow } from "dateNow.js";

const Success = ({ paymet }) => {
  const { userContext, setUserContext } = useContext(Context);
  const [error, setError] = useState(null);
  const SERVER = import.meta.env.VITE_SERVER_URL;
  const today = dateNow();

  const name = userContext?.name || "Usuario";

  useEffect(() => {
    setError(null);

    const newSales = {
      userId: userContext.id,
      products: userContext.cart,
      total: userContext.total,
      date: today,
      typePayment: paymet,
      paymentStatus: "paid",
      email: userContext.email,
    };

    axios
      .post(`${SERVER}/sales`, newSales)
      .then((res) => {
        console.log(res.data);
        setUserContext({
          ...userContext,
          cart: [],
        });
      })
      .catch((e) => {
        console.error(e.message);
        setError(e.message);
      });
  }, [SERVER, today, userContext, paymet, setUserContext]);

  return (
    <>
      <div>
        <p>Muchas gracias por su compra {name}</p>
        <p>Se envio un correo a su email con la confirmacion</p>
        {error && <p>{error}</p>}
      </div>
    </>
  );
};

export default Success;
