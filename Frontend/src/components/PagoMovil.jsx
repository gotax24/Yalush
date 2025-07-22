import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Context } from "../context/UserContext";
import { dateNow } from "../helpers/dateNow";
import "../css/PagoMovil.css";

const phoneCodes = ["0424", "0414", "0412", "0422", "0426", "0416"];

const PagoMovil = ({ total }) => {
  const { userContext } = useContext(Context);
  const [copied, setCopied] = useState({
    banco: false,
    rif: false,
    telefono: false,
  });
  const today = dateNow();
  const SERVER = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  const copy = (type, value) => {
    navigator.clipboard.writeText(value);
    setCopied((prev) => ({
      ...prev,
      [type]: true,
    }));
    setTimeout(() => {
      setCopied((prev) => ({
        ...prev,
        [type]: false,
      }));
    }, 1200);
  };

  const submitSales = async (data) => {
    const cellphone = `${data.code}${data.phone}`;

    if (cellphone.length !== 11 || !/^\d{11}$/.test(cellphone)) {
      setError("phone", {
        type: "manual",
        message: "El número debe tener 11 dígitos.",
      });
      return;
    }

    const newSales = {
      userId: userContext.id,
      products: userContext.cart,
      total: total,
      date: today,
      typePayment: "PagoMovil",
      cellphone,
      refNumber: data.refNumber,
      paymentStatus: "paid",
      email: userContext.email,
    };

    try {
      await axios.post(`${SERVER}/sales`, newSales);

      reset();
      navigate("/success");
    } catch (e) {
      setError("refNumber", { type: "manual", message: e.message });
    }
  };

  return (
    <form className="container-report" onSubmit={handleSubmit(submitSales)}>
      <section className="info-mercantil">
        <img
          className="Logo-Banco"
          src="https://mir-s3-cdn-cf.behance.net/projects/404/ae31f383523705.Y3JvcCw4MDgsNjMyLDAsMA.png"
          alt="Logo de Mercantil"
        />
        <div className="info-row">
          <p className="info-bank">Banco Mercantil</p>
          <button type="button" onClick={() => copy("banco", "mercantil")}>
            {copied.banco ? "¡Copiado!" : "Copiar banco"}
          </button>
        </div>
        <div className="info-row">
          <p className="info-bank">J-00000000000</p>
          <button type="button" onClick={() => copy("rif", "J-00000000000")}>
            {copied.rif ? "¡Copiado!" : "Copiar RIF"}
          </button>
        </div>
        <div className="info-row">
          <p className="info-bank">Tel: 04241111111</p>
          <button type="button" onClick={() => copy("telefono", "04241111111")}>
            {copied.telefono ? "¡Copiado!" : "Copiar teléfono"}
          </button>
        </div>
      </section>

      <label>
        Número de teléfono:
        <div style={{ display: "flex", gap: "10px" }}>
          <select
            {...register("code", { required: "Seleccione el código" })}
            defaultValue=""
          >
            <option value="" disabled>
              Seleccione
            </option>
            {phoneCodes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            type="text"
            maxLength={7}
            placeholder="1234567"
            {...register("phone", {
              required: "El número es requerido",
              pattern: { value: /^\d{7}$/, message: "Debe tener 7 dígitos" },
            })}
            className="cell-phone"
          />
        </div>
        {errors.code && <p className="error">{errors.code.message}</p>}
        {errors.phone && <p className="error">{errors.phone.message}</p>}
      </label>

      <label>
        Número de referencia:
        <input
          type="text"
          placeholder="Número de referencia"
          className="number-ref"
          {...register("refNumber", {
            required: "El número de referencia es requerido",
            minLength: { value: 6, message: "Mínimo 6 dígitos" },
            pattern: { value: /^\d+$/, message: "Solo se permiten números" },
          })}
        />
        {errors.refNumber && (
          <p className="error">{errors.refNumber.message}</p>
        )}
      </label>

      <button className="button-paypal" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Reportar pago"}
      </button>
    </form>
  );
};

export default PagoMovil;
