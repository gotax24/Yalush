import { useEffect, useState } from "react";
import Loading from "./Loading";
import axios from "axios";
import CreditCardForm from "./CreditCartForm";
import "../css/Checkout.css";

const Checkout = ({ total }) => {
  const [loadingPage, setLoadingPage] = useState(false);
  const [errorPage, setErrorPage] = useState(null);
  const [method, setMethod] = useState("creditCard");
  const [ves, setVes] = useState(0);

  useEffect(() => {
    setLoadingPage(true);
    setErrorPage(null);

    axios
      .get(
        `https://pydolarve.org/api/v2/dollar?page=bcv&monitor=mercantil_banco&format_date=default&rounded_price=true'`
      )
      .then((responseCurrencyExchangeInquiry) => {
        setVes(responseCurrencyExchangeInquiry.data.price);
        console.log(responseCurrencyExchangeInquiry.data.price);
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
          {method === "creditCard" && <CreditCardForm total={total} />}

          {method === "paypal" && (
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
              </form>
            </>
          )}

          {method === "pagoMovil" && (
            <>
              <div className="container-ves">
                <p className="tasa-bank">Nuestra tasa es: {ves}Bs</p>
                <p className="title-pagoMovil">Nuestros pago movil</p>
              </div>
              <div className="info-mercantil">
                <img
                  className="Logo-Banco"
                  src="https://mir-s3-cdn-cf.behance.net/projects/404/ae31f383523705.Y3JvcCw4MDgsNjMyLDAsMA.png"
                  alt="Logo de Mercantil"
                />
                <p className="info-bank">Banco Mercantil</p>
                <p className="info-bank">J-00000000000</p>
                <p className="info-bank">Tel: 04241111111</p>
              </div>
              <div className="container-total">
                <p className="total-usd">Monto total en bs = {ves * total}Bs</p>
              </div>
              <div className="container-report">
                <select name="" id="">
                  <option value="0424">0424</option>
                  <option value="0414">0414</option>
                  <option value="0412">0412</option>
                  <option value="0426">0426</option>
                  <option value="0416">0416</option>
                </select>
                <input
                  type="number"
                  placeholder="1234567"
                  maxLength={7}
                  minLength={7}
                  required
                  className="cell-phone"
                />
                <input
                  type="number"
                  placeholder="Numero de referencia"
                  className="number-ref"
                />
              </div>
            </>
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
