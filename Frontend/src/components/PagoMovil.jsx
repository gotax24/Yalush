import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/UserContext";
import { dateNow } from "../helper/dateNow";

const PagoMovil = ({ total, setCart }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userContext, setUserContext } = useContext(Context);
  const today = dateNow();
  const SERVER = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();

  const submitSales = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const newSales = {
      userId: userContext.id,
      products: userContext.cart,
      total: total,
      date: today,
      typePayment: "PagoMovil",
      paymentStatus: "paid",
      email: userContext.email,
    };

    axios
      .post(`${SERVER}/sales`, newSales)
      .then((res) => {
        console.log(res.data);
        setCart([]);
        setUserContext({
          ...userContext,
          cart: [],
        });
        setLoading(false);
        navigate("/success");
      })
      .catch((e) => {
        console.error(e.message);
        setError(e.message);
        setLoading(false);
      });
  };

  return (
    <>
      <form className="container-report" onSubmit={submitSales}>
        <section className="info-mercantil">
          <img
            className="Logo-Banco"
            src="https://mir-s3-cdn-cf.behance.net/projects/404/ae31f383523705.Y3JvcCw4MDgsNjMyLDAsMA.png"
            alt="Logo de Mercantil"
          />
          <p className="info-bank">Banco Mercantil</p>
          <p className="info-bank">J-00000000000</p>
          <p className="info-bank">Tel: 04241111111</p>
        </section>

        <label>
          Numero de telefono: 
          <select name="code" required>
            <option value="">Seleccione</option>
            <option value="0424">0424</option>
            <option value="0414">0414</option>
            <option value="0412">0412</option>
            <option value="0426">0426</option>
            <option value="0416">0416</option>
          </select>
          <input
            type="text"
            name="phone"
            placeholder="1234567"
            pattern="\d{7}"
            required
            className="cell-phone"
          />
        </label>

        <label>
          Número de referencia:
          <input
            type="text"
            name="refNumber"
            placeholder="Número de referencia"
            required
            className="number-ref"
          />
        </label>

        <button className="button-paypal" type="submit">
          {loading ? "Enviando..." : "Reportar pago"}
        </button>

        {error && <p className="error">{error}</p>}
      </form>
    </>
  );
};

export default PagoMovil;
