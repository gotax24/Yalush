import { useState } from "react";
import Loading from "./Loading";
import axios from "axios";

const PaypalForm = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const SERVER = import.meta.env.VITE_SERVER_URL;

  const submitSales = () => {
    setLoading(true);
    setError(null);

    const newSales = {};

    axios.post(`${SERVER}/sales`, newSales);
  };

  if (loading) return <Loading />;

  return (
    <>
      <p className="email-shop">Nuestro correo: ejemplo@ejemplo.com</p>
      <form className="form-paypal">
        <label htmlFor="paypalEmail">PayPal Correo</label>
        <input
          type="email"
          id="paypalEmail"
          name="paypalEmail"
          placeholder="email@example.com"
          required
        />

        <button onClick={() => submitSales}>
          {loading ? "Pagando.." : "Pagar con Paypal"}
        </button>

        {error && <span className="error">{error}</span>}
      </form>
    </>
  );
};

export default PaypalForm;
