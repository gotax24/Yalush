import { useEffect, useState } from "react";
import Loading from "./Loading";
import axios from "axios";
import CreditCardForm from "./CreditCartForm";
import "../css/Checkout.css";
import PaypalForm from "./PaypalForm";
import PagoMovil from "./PagoMovil";

const Checkout = ({ total, setCart }) => {
  const [loadingPage, setLoadingPage] = useState(false);
  const [errorPage, setErrorPage] = useState(null);
  const [method, setMethod] = useState("creditCard");
  const [ves, setVes] = useState(0);
  const [userPay, setUserPay] = useState({});

  useEffect(() => {
    setLoadingPage(true);
    setErrorPage(null);

    axios
      .get(
        `https://pydolarve.org/api/v2/dollar?page=bcv&monitor=mercantil_banco&format_date=default&rounded_price=true'`
      )
      .then((responseCurrencyExchangeInquiry) => {
        setVes(responseCurrencyExchangeInquiry.data.price);
      })
      .catch((e) => {
        console.error(e);
        setErrorPage(e.mesagge);
      })
      .finally(() => {
        setLoadingPage(false);
      });
  }, [total]);

  if (loadingPage) return <Loading />;

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

          {method === "zelle" && (
            <>
              <div className="container-main">
                <p>Nuestro correo: ejemplo@ejemplo.com</p>
                <input type="text" placeholder="Titular de la cuenta" />
                <input type="text" placeholder="Referencia del zelle" />
              </div>
            </>
          )}
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
      </main>
      {errorPage && <p>{errorPage.mesagge}</p>}
    </>
  );
};

export default Checkout;
