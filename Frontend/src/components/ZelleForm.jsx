import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/UserContext";
import { dateNow } from "../helper/dateNow";
import { useCopy } from "../hooks/useCopy";
import axios from "axios";
import HandleInputChange from "../helper/HandleInputChange";
import "../css/ZelleForm.css";

const ZelleForm = ({ total, setCart }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userPay, setUserPay] = useState({ owner: "", refNumber: "" });
  const { userContext, setUserContext } = useContext(Context);
  const { copied, copy } = useCopy();
  const today = dateNow();
  const SERVER = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();

  const handleNewSales = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!userPay.owner || !userPay.refNumber) {
      setLoading(false);
      setError("Por favor, completa todos los campos.");
      return;
    }

    const newSales = {
      userId: userContext.id,
      products: userContext.cart,
      total: total,
      date: today,
      typePayment: "PagoMovil",
      cellphone: userPay.owner,
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
      <form className="conatiner-zelle" onSubmit={handleNewSales}>
        <p className="example-email">Nuestro correo: ejemplo@ejemplo.com</p>{" "}
        <button
          className="button-copy-zelle"
          onClick={() => copy("ejemplo@ejemplo.com")}
        >
          {copied ? "Copidado" : "Copiar!"}
        </button>
        <input
          type="text"
          placeholder="Titular de la cuenta"
          onChange={(e) =>
            HandleInputChange("owner", e.target.value, setUserPay)
          }
          required
          className="input-zelle"
        />
        <input
          type="text"
          placeholder="Referencia del zelle"
          onChange={(e) =>
            HandleInputChange("refNumber", e.target.value, setUserPay)
          }
          required
          className="input-zelle"
        />
        <button className="button-zelle">
          {loading ? "Resportando pago..." : "Reportar pago"}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </>
  );
};

export default ZelleForm;
