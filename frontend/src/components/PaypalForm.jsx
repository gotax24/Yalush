import { useContext } from "react";
import axios from "axios";
import { dateNow } from "../helpers/dateNow";
import { Context } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useCopy } from "../hooks/useCopy";
import { useForm } from "react-hook-form";
import "../css/PaypalForm.css";

const PaypalForm = ({ total }) => {
  const { userContext } = useContext(Context);
  const { copied, copy } = useCopy();
  const today = dateNow();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
  });
  const SERVER = import.meta.env.VITE_SERVER_URL;
  const regexEmail =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

  const submitSales = (data) => {
    setError(null);

    const newSales = {
      userId: userContext.id,
      products: userContext.cart,
      total: total,
      date: today,
      typePayment: "Paypal",
      paymentStatus: "paid",
      email: userContext.email,
      emailPaypal: data.paypalEmail,
    };

    axios
      .post(`${SERVER}/sales`, newSales)
      .then((res) => {
        console.log(res.data);

        navigate("/success");
      })
      .catch((e) => {
        console.error(e.message);
        setError("serverError", {
          type: "manual",
          message: "Error al procesar el pago. Inténtalo de nuevo.",
        });
      });
  };

  return (
    <>
      <p className="email-shop">Nuestro correo: ejemplo@ejemplo.com</p>
      <button onClick={() => copy("ejemplo@ejemplo.com")}>
        {copied ? "¡Copiado!" : "Copiar correo"}
      </button>
      <form className="form-paypal" onSubmit={handleSubmit(submitSales)}>
        <label htmlFor="paypalEmail" className="label-paypal">
          PayPal Correo:
          <input
            type="email"
            id="paypalEmail"
            name="paypalEmail"
            placeholder="email@example.com"
            className="input-paypal"
            {...register("paypalEmail", {
              required: "El correo es obligatorio",
              pattern: {
                value: regexEmail,
                message: "Correo electrónico inválido",
              },
            })}
          />
          {errors.paypalEmail && (
            <span className="error-paypal">{errors.paypalEmail.message}</span>
          )}
        </label>

        <button className="button-paypal" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Pagando.." : "Pagar con Paypal"}
        </button>
        {errors.root?.serverError && (
          <span className="error-paypal">
            {errors.root?.serverError.message}
          </span>
        )}
      </form>
    </>
  );
};

export default PaypalForm;
