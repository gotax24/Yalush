import { useEffect, useState } from "react";
import axios from "axios";
import iconComment from "../assets/iconComment.svg";
import HandleInputChange from "../helper/HandleInputChange";
import "../css/AddCommentForm.css";

const AddFormComments = ({
  userId,
  productId,
  closeModal,
  currentReviews,
  updateProductReviews,
}) => {
  const [review, setReview] = useState({
    userId: userId,
    rating: "",
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const SERVER = import.meta.env.VITE_SERVER_URL;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!review.userId || !review.rating || !review.comment) {
      setError("Todos los campos son obligatorios.");
      setLoading(false);
      return;
    }

    if (verifyRating(review.rating)) {
      const reviewsArray = Array.isArray(currentReviews) ? currentReviews : [];
      const updatedReviews = [...reviewsArray, review];

      axios
        .patch(`${SERVER}/products/${productId}`, { review: updatedReviews })
        .then((response) => {
          const data = response.data;
          console.log(data);

          updateProductReviews(updatedReviews);

          setLoading(false);
          closeModal();
        })
        .catch((e) => {
          console.error(e);
          setError(e.message);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    setReview((prevUser) => ({
      ...prevUser,
      userId: userId,
    }));
  }, [userId]);

  const verifyRating = (value) => {
    if (value.length > 1) {
      setError("Solo se permite un solo número del 1 al 5.");
      return false;
    }

    if (isNaN(value)) {
      setError("Debe ser un número válido.");
      return false;
    }

    if (value < 1 || value > 5) {
      setError("El número debe estar entre 1 y 5.");
      return false;
    }

    setError("");
    return true;
  };

  return (
    <>
      <div className="container-addForm">
        <div className="header-form">
          <img src={iconComment} alt="icono de agregar comentarios" />
          <h1 className="title-addForm">Agregar un comentario</h1>
        </div>
        <div className="content-form">
          <form>
            <label className="labels-form">
              Puntacion del producto:
              <input
                type="number"
                max={5}
                min={1}
                placeholder="Numero del 1 al 5"
                className="input-number"
                onChange={(e) => {
                  const value = Math.max(
                    1,
                    Math.min(5, Number(e.target.value))
                  );
                  HandleInputChange("rating", value, setReview);
                  verifyRating(Number(e.target.value));
                }}
              />
            </label>
            <label className="labels-form">
              Comentario:
              <textarea
                maxLength={250}
                className="input-comment"
                placeholder="Escriba su opinion del producto"
                onChange={(e) =>
                  HandleInputChange("comment", e.target.value, setReview)
                }
              />
            </label>
          </form>
        </div>
        <button className="button-comment" onClick={handleSubmit}>
          {loading ? "Confirmando comentario..." : "Confirmar comentario"}
        </button>
      </div>

      {error && <p className="error-p">{error}</p>}
    </>
  );
};

export default AddFormComments;
