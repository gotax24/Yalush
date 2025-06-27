import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/UserContext";
import { dateNow } from "../helper/dateNow";
import HandleInputChange from "../helper/HandleInputChange";
import "../css/PagoMovil.css";

const PagoMovil = ({ total, setCart }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userContext, setUserContext } = useContext(Context);
  const today = dateNow();
  const SERVER = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();
  const [userPay, setUserPay] = useState({ cellphone: "", refNumber: "" });
  const [phoneParts, setPhoneParts] = useState({ code: "", phone: "" });

  const handlePhoneParts = (e) => {
    const { name, value } = e.target;

    // Validar solo dígitos
    if (name === "phone" && !/^\d*$/.test(value)) return;

    // Si son más de 7 dígitos, no hacer nada
    if (name === "phone" && value.length > 7 || value.length < 7) {
      setError("Solo se permiten 7 dígitos");
      return;
    }

    setError(null); // Limpiar error al corregir

    const newPhoneParts = {
      ...phoneParts,
      [name]: value,
    };

    setPhoneParts(newPhoneParts);

    // Combinar número completo solo cuando hay ambos
    if (newPhoneParts.code && newPhoneParts.phone.length === 7) {
      const phoneFullNumber = `${newPhoneParts.code}${newPhoneParts.phone}`;
      setUserPay((prev) => ({
        ...prev,
        cellphone: phoneFullNumber,
      }));
    }
  };
  
  const submitSales = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (
      userPay.cellphone.length !== 11 ||
      !/^\d{11}$/.test(userPay.cellphone)
    ) {
      setError("El número de teléfono debe tener 11 dígitos.");
      setLoading(false);
      return;
    }

    if (
      !userPay.refNumber ||
      userPay.refNumber.length < 6 ||
      !/^\d+$/.test(userPay.refNumber)
    ) {
      setError("El número de referencia debe tener al menos 6 dígitos.");
      setLoading(false);
      return;
    }

    console.log(userPay);

    const newSales = {
      userId: userContext.id,
      products: userContext.cart,
      total: total,
      date: today,
      typePayment: "PagoMovil",
      cellphone: userPay.cellphone,
      refNumber: userPay.refNumber,
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
          <select
            name="code"
            required
            defaultValue={""}
            onChange={handlePhoneParts}
          >
            <option value="" disabled>
              Seleccione
            </option>
            <option value="0424">0424</option>
            <option value="0414">0414</option>
            <option value="0412">0412</option>
            <option value="0426">0426</option>
            <option value="0416">0416</option>
          </select>
          <input
            type="number"
            name="phone"
            placeholder="1234567"
            maxLength={7}
            required
            className="cell-phone"
            onChange={handlePhoneParts}
          />
        </label>

        <label>
          Número de referencia:
          <input
            type="number"
            name="refNumber"
            placeholder="Número de referencia"
            required
            className="number-ref"
            onChange={(e) =>
              HandleInputChange("refNumber", Number(e.target.value), setUserPay)
            }
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
