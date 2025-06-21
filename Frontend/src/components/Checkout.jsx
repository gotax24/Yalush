import { useState } from "react";
import { useDailyDollarRate } from "../hooks/useDollarToday";
import Loading from "./Loading";
import CreditCardForm from "./CreditCartForm";
import PaypalForm from "./PaypalForm";
import PagoMovil from "./PagoMovil";
import ZelleForm from "./ZelleForm";
import "../css/Checkout.css";

const Checkout = ({ total, setCart }) => {
  const [method, setMethod] = useState("creditCard");
  const { ves, loading: loadingVes, error: errorVes } = useDailyDollarRate();

  if (loadingVes) return <Loading />;

  return (
    <>
      <main>
        <section>
          <button onClick={() => setMethod("creditCard")}>
            Tarjeta de credito
          </button>
          <button onClick={() => setMethod("paypal")}>Paypal</button>
          <button onClick={() => setMethod("pagoMovil")}>Pago movil</button>
          <button onClick={() => setMethod("zelle")}>Zelle</button>
        </section>
        <section>
          {method === "creditCard" && (
            <CreditCardForm total={total} setCart={setCart} />
          )}

          {method === "paypal" && (
            <PaypalForm setCart={setCart} total={total} />
          )}

          {method === "pagoMovil" && (
            <PagoMovil total={total} setCart={setCart} />
          )}

          {method === "zelle" && <ZelleForm total={total} setCart={setCart} />}
        </section>
        <section className="section-pay">
          <ul className="payment-summary">
            <li>
              <span>Tasa Bancaria(BCV):</span>
              <span>{ves}Bs</span>
            </li>
            <li>
              <span>Subtotal (USD):</span>
              <span>{total}$</span>
            </li>
            <li>
              <span>Subtotal (Bs):</span>
              <span>{(total * ves).toFixed(2)} Bs</span>
            </li>
            <li>
              <span>Envío:</span>
              <span>0$</span>
            </li>
            <li className="total">
              <strong>Total:</strong>
              <strong>
                {total}$ | {(total * ves).toFixed(2)} Bs
              </strong>
            </li>
          </ul>
        </section>
        {errorVes && <p>{errorVes}</p>}
      </main>
    </>
  );
};

export default Checkout;
