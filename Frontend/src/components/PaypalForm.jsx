import { useContext, useState } from "react";
import Loading from "./Loading";
import axios from "axios";
import { dateNow } from "../helpers/dateNow";
import { Context } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useCopy } from "../hooks/useCopy";
import "../css/PaypalForm.css";

const PaypalForm = ({ setCart, total }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailPaypal, setEmailPaypal] = useState("");
  const { userContext, setUserContext } = useContext(Context);
  const { copied, copy } = useCopy();
  const today = dateNow();
  const navigate = useNavigate();
  const regexEmail =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
  const SERVER = import.meta.env.VITE_SERVER_URL;

  const submitSales = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!regexEmail.test(emailPaypal)) {
      setLoading(false);
      setError("Correo invalido");
      return;
    }

    const newSales = {
      userId: userContext.id,
      products: userContext.cart,
      total: total,
      date: today,
      typePayment: "Paypal",
      paymentStatus: "paid",
      email: userContext.email,
      emailPaypal: emailPaypal,
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

  if (loading) return <Loading />;

  return (
    <>
      <p className="email-shop">Nuestro correo: ejemplo@ejemplo.com</p>
      <button onClick={() => copy("ejemplo@ejemplo.com")}>
        {copied ? "¡Copiado!" : "Copiar correo"}
      </button>
      <form className="form-paypal">
        <label htmlFor="paypalEmail" className="label-paypal">
          PayPal Correo:
          <input
            type="email"
            id="paypalEmail"
            name="paypalEmail"
            placeholder="email@example.com"
            className="input-paypal"
            onChange={(e) => setEmailPaypal(e.target.value)}
            required
          />
        </label>

        <button className="button-paypal" onClick={submitSales}>
          {loading ? "Pagando.." : "Pagar con Paypal"}
        </button>

        {error && <span className="error-paypal">{error}</span>}
      </form>
    </>
  );
};

export default PaypalForm;
