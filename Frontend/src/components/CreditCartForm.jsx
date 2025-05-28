import { useContext, useState } from "react";
import "../css/CreditCardForm.css";
import { Context } from "../context/UserContext";
import Loading from "./Loading";
import { loadStripe } from "@stripe/stripe-js";

const CreditCardForm = () => {
  const { userContext } = useContext(Context);
  const [error, setError] = useState(null);
  const SERVER = import.meta.env.VITE_URL_SERVER;
  const STRIPE_PROMISE = import.meta.env.VITE_STRIPE_PUBLI;

  const handleStripeRedirect = async () => {
    const stripe = await loadStripe(STRIPE_PROMISE);

    const { error } = await stripe.redirectToCheckout({
      lineItems: [
        {
          price: "prod_SOKsVpBjw1pkr7", 
          quantity: 1,
        },
      ],
      mode: "payment",
      successUrl: "https://tuapp.vercel.app/success",
      cancelUrl: "https://tuapp.vercel.app/cancel",
      customerEmail: userContext.email,
    });

    if (error) {
      setError(error.message);
    }
  };

  return (
    <form className="form">
      <label htmlFor="name" className="label">
        <span className="title">Nombre completo en la tarjeta</span>
        <input
          className="input-field"
          type="text"
          name="input-name"
          title="Input title"
          placeholder="Enter your full name"
        />
      </label>
      <label htmlFor="serialCardNumber" className="label">
        <span className="title">Numero de tarjeta</span>
        <input
          id="serialCardNumber"
          className="input-field"
          type="number"
          name="input-name"
          title="Input title"
          placeholder="0000 0000 0000 0000"
        />
      </label>
      <div className="split">
        <label htmlFor="ExDate" className="label">
          <span className="title">Fecha de vencimiento</span>
          <input
            id="ExDate"
            className="input-field"
            type="text"
            name="input-name"
            title="Expiry Date"
            placeholder="01/23"
          />
        </label>
        <label htmlFor="cvv" className="label">
          <span className="title"> CVV</span>
          <input
            id="cvv"
            className="input-field"
            type="number"
            name="cvv"
            title="CVV"
            placeholder="CVV"
          />
        </label>
      </div>
      <button onClick={() => handleStripeRedirect}>
        Pagar con tarjeta de credito
      </button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default CreditCardForm;
