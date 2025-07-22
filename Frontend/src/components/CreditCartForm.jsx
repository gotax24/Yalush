import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form"; // No necesitas importar nada más de aquí
import { useNavigate } from "react-router-dom";
import { Context } from "../context/UserContext.jsx";
import { dateNow } from "../helpers/dateNow.js";
import { luhnCheck } from "../utils/Lunhn.js";
import { isValidExpiryDate } from "../utils/isValidDateCard.js";
import axios from "axios";
import visa from "../assets/visa.svg";
import masterCard from "../assets/masterCard.svg";
import americanExpress from "../assets/americanExpress.svg";
import "../css/CreditCardForm.css";

const CreditCardForm = ({ total }) => {
  const [cardType, setCardType] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch, //Importamos 'watch' para observar cambios
    setValue, //Para formatear los inputs
    setError,
  } = useForm();

  const { userContext } = useContext(Context);
  const SERVER = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();

  // Usamos watch para detectar el tipo de tarjeta
  const cardNumberValue = watch("cardNumber");
  useEffect(() => {
    if (cardNumberValue) {
      const cleanNumber = cardNumberValue.replace(/\s/g, "");
      if (cleanNumber.startsWith("4")) setCardType(visa);
      else if (cleanNumber.startsWith("5") || cleanNumber.startsWith("2"))
        setCardType(masterCard);
      else if (cleanNumber.startsWith("3")) setCardType(americanExpress);
      else setCardType(null);
    }
  }, [cardNumberValue]);

  const submitSales = async (data) => {
    const newSales = {
      userId: userContext.id,
      products: userContext.cart,
      total: total,
      date: dateNow(),
      typePayment: "creditCard",
      paymentStatus: "paid",
      email: userContext.email,
    };

    try {
      const response = await axios.post(`${SERVER}/sales`, newSales);
      console.log(response.data);
      console.log("Venta registrada correctamente", data);

      navigate("/success");
    } catch (error) {
      console.error(error);
      setError("root", {
        message: "Error al procesar el pago. Inténtalo de nuevo.",
      });
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit(submitSales)}>
      {/* --- CAMPO NOMBRE --- */}
      <label className="label">
        <span className="title">Nombre completo en la tarjeta</span>
        <input
          className="input-field"
          type="text"
          placeholder="Ingresa tu nombre completo"
          {...register("cardName", {
            required: "El nombre es requerido",
            minLength: {
              value: 3,
              message: "El nombre debe tener más de 2 letras",
            },
            pattern: {
              value: /^[A-Za-z\s]+$/,
              message: "El nombre solo puede contener letras",
            },
          })}
        />
        {errors.cardName && (
          <span style={{ color: "#a11919" }}>{errors.cardName.message}</span>
        )}
      </label>

      {/* --- CAMPO NÚMERO DE TARJETA --- */}
      <label className="label">
        <span className="title">Número de tarjeta</span>
        <div className="input-with-icon">
          <input
            type="text"
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            {...register("cardNumber", {
              required: "El número de tarjeta es requerido",
              validate: (value) =>
                luhnCheck(value.replace(/\s/g, "")) ||
                "Número de tarjeta inválido",
              onChange: (e) => {
                const { value } = e.target;
                e.target.value = value
                  .replace(/\D/g, "")
                  .replace(/(\d{4})(?=\d)/g, "$1 ");
                setValue("cardNumber", e.target.value);
              },
            })}
          />
          {cardType && (
            <img className="img-credit" src={cardType} alt="Tipo de tarjeta" />
          )}
        </div>
        {errors.cardNumber && (
          <span style={{ color: "#a11919" }}>{errors.cardNumber.message}</span>
        )}
      </label>

      <div className="split">
        {/* --- CAMPO FECHA DE VENCIMIENTO --- */}
        <label className="label">
          <span className="title">Fecha de vencimiento</span>
          <input
            type="text"
            placeholder="MM/AA"
            maxLength={5}
            {...register("expiryDate", {
              required: "La fecha es requerida",
              validate: (value) =>
                isValidExpiryDate(value) || "Fecha inválida o vencida",
              onChange: (e) => {
                const { value } = e.target;
                e.target.value = value
                  .replace(/\D/g, "")
                  .replace(/(\d{2})(?=\d)/g, "$1/");
                setValue("expiryDate", e.target.value);
              },
            })}
          />
          {errors.expiryDate && (
            <span style={{ color: "#a11919" }}>
              {errors.expiryDate.message}
            </span>
          )}
        </label>

        {/* --- CAMPO CVV --- */}
        <label className="label">
          <span className="title">CVV</span>
          <input
            type="text"
            placeholder="123"
            maxLength="4"
            {...register("cvv", {
              required: "El CVV es requerido",
              pattern: { value: /^[0-9]{3,4}$/, message: "CVV inválido" },
            })}
          />
          {errors.cvv && (
            <span style={{ color: "#a11919" }}>{errors.cvv.message}</span>
          )}
        </label>
      </div>

      <button className="checkout-btn" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Procesando..." : "Pagar con tarjeta"}
      </button>

      {errors.root && (
        <span style={{ color: "#a11919" }}>{errors.root.message}</span>
      )}
    </form>
  );
};

export default CreditCardForm;
