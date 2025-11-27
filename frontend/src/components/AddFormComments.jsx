import { useForm } from "react-hook-form";
import axios from "axios";
import iconComment from "../assets/iconComment.svg";
import "../css/AddCommentForm.css";

const AddFormComments = ({
  userId,
  productId,
  closeModal,
  currentReviews,
  updateProductReviews,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, // <-- Obtenemos 'isSubmitting' y 'errors'
    setError, // <-- Obtenemos setError para errores del servidor
  } = useForm();

  const SERVER = import.meta.env.VITE_SERVER_URL;

  // La función ahora es async/await para un código más limpio
  const onSubmit = async (data) => {
    // 1. Añadimos el userId a los datos del formulario
    const newReview = { ...data, rating: Number(data.rating), userId: userId };

    const reviewsArray = Array.isArray(currentReviews) ? currentReviews : [];
    const updatedReviews = [...reviewsArray, newReview];

    try {
      await axios.patch(`${SERVER}/products/${productId}`, { review: updatedReviews });
      updateProductReviews(updatedReviews);
      closeModal();
    } catch (e) {
      console.error(e);
      // Opcional: manejar errores del servidor y mostrarlos
      setError("root.serverError", {
        type: "manual",
        message: "No se pudo agregar el comentario. Inténtalo de nuevo.",
      });
    }
  };

  return (
    <>
      <div className="container-addForm">
        <div className="header-form">
          <img src={iconComment} alt="icono de agregar comentarios" />
          <h1 className="title-addForm">Agregar un comentario</h1>
        </div>
        <div className="content-form">
          <p className="subtitle-addForm">
            Tu opinión es importante para nosotros. ¡Déjanos tu comentario!
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="labels-form">
              Puntuación del producto:
              <input
                type="number"
                placeholder="Número del 1 al 5"
                className="input-number"
                {...register("rating", {
                  required: "La puntuación es requerida",
                  min: { value: 1, message: "La puntuación debe ser entre 1 y 5" },
                  max: { value: 5, message: "La puntuación debe ser entre 1 y 5" },
                })}
              />
              {errors.rating && <p className="error-p">{errors.rating.message}</p>}
            </label>
            <label className="labels-form">
              Comentario:
              <textarea
                className="input-comment"
                placeholder="Escriba su opinión del producto"
                {...register("comment", {
                  required: "El comentario es requerido",
                  minLength: { value: 10, message: "Mínimo 10 caracteres" },
                  maxLength: { value: 250, message: "Máximo 250 caracteres" },
                })}
              />
              {errors.comment && <p className="error-p">{errors.comment.message}</p>}
            </label>
            <button type="submit" className="button-comment" disabled={isSubmitting}>
              {isSubmitting ? "Confirmando..." : "Confirmar comentario"}
            </button>
            {errors.root?.serverError && <p className="error-p">{errors.root.serverError.message}</p>}
          </form>
        </div>
      </div>
    </>
  );
};

export default AddFormComments;