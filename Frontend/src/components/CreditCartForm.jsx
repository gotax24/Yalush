import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/UserContext";
import { dateNow } from "../helpers/dateNow.js";
import { formatCardNumber } from "../utils/formatCardNumber.js";
import { formatExpiryDate } from "../utils/formatExpiryDate.js";
import { luhnCheck } from "../utils/Lunhn.js";
import { isValidExpiryDate } from "../utils/isValidDateCard.js";
import CardInput from "./CardInputs.jsx";
import axios from "axios";
import HandleInputChange from "../helpers/HandleInputChange.js";
import visa from "../assets/visa.svg";
import masterCard from "../assets/masterCard.svg";
import americanExpress from "../assets/americanExpress.svg";
import "../css/CreditCardForm.css";

const CreditCardForm = ({ total, setCart }) => {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [cardType, setCardType] = useState();
  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    amount: total,
  });

  const { userContext } = useContext(Context);
  const SERVER = import.meta.env.VITE_SERVER_URL;
  const today = dateNow();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.cardName.trim()) {
      newErrors.cardName = "El nombre es requerido";
    } else if (formData.cardName.trim().length < 3) {
      // Corregí la lógica
      newErrors.cardName = "El nombre debe tener más de 2 letras";
    }

    // Validar número de tarjeta
    const cardNumberClean = formData.cardNumber.replace(/\s/g, "");
    if (!cardNumberClean) {
      newErrors.cardNumber = "Número de tarjeta requerido";
    } else if (cardNumberClean.length < 13 || cardNumberClean.length > 19) {
      newErrors.cardNumber = "Número de tarjeta inválido";
    } else if (!luhnCheck(cardNumberClean)) {
      newErrors.cardNumber = "Número de tarjeta inválido";
    }

    // Validar fecha de expiración
    if (!formData.expiryDate) {
      newErrors.expiryDate = "La fecha de expiración es requerida";
    } else if (!isValidExpiryDate(formData.expiryDate)) {
      newErrors.expiryDate = "Fecha de expiración inválida o vencida";
    }

    // Validar CVV
    if (!formData.cvv) {
      newErrors.cvv = "El CVV es requerido";
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = "CVV inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitSales = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validar antes de enviar
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const newSales = {
      userId: userContext.id,
      products: userContext.cart,
      total: total,
      date: today,
      typePayment: "creditCard",
      paymentStatus: "paid",
      email: userContext.email,
    };

    try {
      const response = await axios.post(`${SERVER}/sales`, newSales);
      console.log(response.data);

      // Limpiar carrito al completar compra
      setCart([]);
      //se envia al usuario la pagina de sucess
      navigate("/success");
    } catch (error) {
      console.error(error);
      setErrors({
        submit: error.response?.data?.message || "Error al procesar el pago",
      });
      setLoading(false);
    }
  };

  // Función para manejar cambios con validación en tiempo real
  const handleCardNumberChange = (e) => {
    const value = e.target.value;
    const formattedValue = formatCardNumber(value);
    HandleInputChange("cardNumber", formattedValue, setFormData);
    setCardType(getCardType(e.target.value));

    // Limpiar error si existe
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: null }));
    }
  };

  const handleExpiryDateChange = (e) => {
    const value = e.target.value;
    const formattedValue = formatExpiryDate(value);
    HandleInputChange("expiryDate", formattedValue, setFormData);

    // Limpiar error si existe
    if (errors.expiryDate) {
      setErrors((prev) => ({ ...prev, expiryDate: null }));
    }
  };

  const getCardType = (number) => {
    const cleanNumber = number.replace(/\s/g, "");
    if (cleanNumber.startsWith("4")) return visa;
    if (cleanNumber.startsWith("5") || cleanNumber.startsWith("2"))
      return masterCard;
    if (cleanNumber.startsWith("3")) return americanExpress;

    return null;
  };

  return (
    <form className="form" onSubmit={submitSales}>
      <label htmlFor="cardName" className="label">
        <span className="title">Nombre completo en la tarjeta</span>
        <input
          id="cardName"
          className="input-field"
          type="text"
          name="cardName"
          placeholder="Ingresa tu nombre completo"
          value={formData.cardName}
          onChange={(e) => {
            HandleInputChange("cardName", e.target.value, setFormData);
            if (errors.cardName) {
              setErrors((prev) => ({ ...prev, cardName: null }));
            }
          }}
        />
        {errors.cardName && <span style={{ color: "#a11919" }}>{errors.cardName}</span>}
      </label>

      <label htmlFor="serialCardNumber" className="label">
        <span className="title">Número de tarjeta</span>
        <div className="input-with-icon">
          <CardInput
            formData={formData.cardNumber}
            id={"serialCardNumber"}
            className={"input-field"}
            type={"text"}
            name={"cardNumber"}
            placeholder={"0000 0000 0000 000"}
            maxLength={19}
            functionChange={handleCardNumberChange}
          />
          {cardType && (
            <img className="img-credit" src={cardType} alt="Tipo de tarjeta" />
          )}
        </div>
        {errors.cardNumber && (
          <span style={{ color: "#a11919" }}>{errors.cardNumber}</span>
        )}
      </label>

      <div className="split">
        <label htmlFor="ExDate" className="label">
          <span className="title">Fecha de vencimiento</span>
          <CardInput
            id={"Exdate"}
            className={"input-field"}
            type={"text"}
            name={"expiryDate"}
            placeholder={"MM/AA"}
            formData={formData.expiryDate}
            maxLength={5}
            functionChange={handleExpiryDateChange}
          />
          {errors.expiryDate && (
            <span style={{ color: "#a11919" }}>{errors.expiryDate}</span>
          )}
        </label>

        <label htmlFor="cvv" className="label">
          <span className="title">CVV</span>
          <input
            id="cvv"
            className="input-field"
            type="text"
            name="cvv"
            placeholder="123"
            value={formData.cvv}
            maxLength="4"
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").substring(0, 4);
              HandleInputChange("cvv", value, setFormData);
              if (errors.cvv) {
                setErrors((prev) => ({ ...prev, cvv: null }));
              }
            }}
          />
          {errors.cvv && <span style={{ color: "#a11919" }}>{errors.cvv}</span>}
        </label>
      </div>

      <button className="checkout-btn" type="submit" disabled={loading}>
        {loading ? "Procesando..." : "Pagar con tarjeta de crédito"}
      </button>

      {errors.submit && <p style={{ color: "#a11919" }}>{errors.submit}</p>}
    </form>
  );
};

export default CreditCardForm;
