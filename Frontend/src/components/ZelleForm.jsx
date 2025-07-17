import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/UserContext";
import { dateNow } from "../helpers/dateNow";
import { useCopy } from "../hooks/useCopy";
import { useForm } from "react-hook-form";
import axios from "axios";
import "../css/ZelleForm.css";

const ZelleForm = ({ total }) => {
  const [loading, setLoading] = useState(false);
  const { userContext } = useContext(Context);
  const { copied, copy } = useCopy();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: { owner: "", refNumber: "" },
  });
  const today = dateNow();
  const SERVER = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();

  const handleNewSales = (data) => {
    setLoading(true);
    setError(null);

    const newSales = {
      userId: userContext.id,
      products: userContext.cart,
      total: total,
      date: today,
      typePayment: "PagoMovil",
      cellphone: data.owner,
      refNumber: data.refNumber,
      paymentStatus: "paid",
      email: userContext.email,
    };

    axios
      .post(`${SERVER}/sales`, newSales)
      .then((res) => {
        console.log(res.data);
        setLoading(false);
        navigate("/success");
      })
      .catch((e) => {
        console.error(e.message);
        setError("serverError", {
          type: "manual",
          message: "Error al procesar el pago. Inténtalo de nuevo.",
        });

        setLoading(false);
      });
  };

  return (
    <>
      <form className="conatiner-zelle" onSubmit={handleSubmit(handleNewSales)}>
        <p className="example-email">Nuestro correo: ejemplo@ejemplo.com</p>{" "}
        <button
          className="button-copy-zelle"
          onClick={() => copy("ejemplo@ejemplo.com")}
        >
          {copied ? "Copidado" : "Copiar!"}
        </button>
        <input
          type="text"
          placeholder="Titular de la cuenta"
          {...register("owner", {
            required: "El titular es requerido",
            pattern: {
              value: /^[A-Za-z\s]+$/,
              message: "Solo se permiten letras y espacios",
            },
            maxLength: { value: 50, message: "Máximo 50 caracteres" },
          })}
          className="input-zelle"
        />
        {errors?.owner && (
          <span className="p-errors">{errors?.owner?.message}</span>
        )}
        <input
          type="text"
          placeholder="Referencia del zelle"
          {...register("refNumber", {
            required: "La referencia es requerida",
            pattern: {
              value: /^[0-9-A-Za-z]+$/,
              message: "Solo se permiten números y letras",
            },
            maxLength: { value: 30, message: "Máximo 30 caracteres" },
          })}
          className="input-zelle"
        />
        {errors?.refNumber && (
          <span className="p-errors">{errors?.refNumber?.message}</span>
        )}
        <button className="button-zelle">
          {loading ? "Resportando pago..." : "Reportar pago"}
        </button>
        {errors.root?.serverError && (
          <p className="error">{errors.root.serverError.message}</p>
        )}
      </form>
    </>
  );
};

export default ZelleForm;
