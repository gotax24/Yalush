import { useState } from "react";
import { useForm } from "react-hook-form";
import { SendEmailContact } from "../helpers/SendEmailContact";
import axios from "axios";
import Loading from "./Loading";
import "../css/Contact.css";

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [messageClient, setMessageClient] = useState("");
  const SERVER = import.meta.env.VITE_SERVER_URL;

  const submit = async (data) => {
    setMessageClient("");
    setLoading(true);

    try {
      await SendEmailContact(data);
      console.log("Mensaje enviado al correo");

      await axios.post(`${SERVER}/clientMessage`, data);
      setMessageClient("¡Mensaje enviado con éxito! Te responderemos pronto.");
      reset();
    } catch (error) {
      console.error("No se pudo completar la operación: ", error.message);
      setMessageClient(
        "Hubo un error al enviar el mensaje. Inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <Loading />;

  return (
    <div className="contact-container">
      <div className="contact-card">
        <h1 className="contact-title">Contáctanos</h1>
        <p className="contact-subtitle">
          ¿Tienes dudas, sugerencias o necesitas ayuda? ¡Escríbenos!
        </p>
        <form className="contact-form" onSubmit={handleSubmit(submit)}>
          <label>
            Nombre
            <input
              type="text"
              placeholder="Tu nombre"
              {...register("name", {
                required: "El nombre esta vacio",
                pattern: /^[A-Za-z\s]+$/,
                maxLength: 20,
              })}
            />
          </label>
          {errors?.name && (
            <span className="p-errors">{errors?.name?.message}</span>
          )}
          <label>
            Correo electronico
            <input
              type="email"
              placeholder="tu@email.com"
              {...register("email", {
                required: "El correo es requerido",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message:
                    "Por favor, introduce una dirección de correo válida",
                },
              })}
            />
          </label>
          {errors?.email && (
            <span className="p-errors">{errors?.email?.message}</span>
          )}
          <label>
            Mensaje que desea enviar
            <textarea
              placeholder="¿En qué podemos ayudarte?"
              {...register("message", {
                required: "El mensaje no puede estar vacío",
                minLength: {
                  value: 10,
                  message: "El mensaje debe tener al menos 10 caracteres",
                },
                maxLength: {
                  value: 350,
                  message: "El mensaje no puede superar los 350 caracteres",
                },
              })}
            />
          </label>
          {errors?.message && (
            <span className="p-errors">{errors?.message?.message}</span>
          )}
          <button type="submit" className="contact-btn">
            Enviar mensaje
          </button>
        </form>
        <div className="contact-info">
          <p>
            <strong>Email:</strong> contacto@yalush.com
          </p>
          <p>
            <strong>Teléfono:</strong> +58 123-4567890
          </p>
          <p>
            <strong>Dirección:</strong> Maracaibo, Venezuela
          </p>
          {messageClient && <p className="message-finals">{messageClient}</p>}
        </div>
      </div>
    </div>
  );
};

export default Contact;
