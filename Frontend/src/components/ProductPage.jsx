import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import Loading from "./Loading.jsx";
import axios from "axios";
import FirstLetterUpper from "../helper/FirstLetterUpper.js";
import Translator from "../helper/Translator.js";
import Comments from "./Comments.jsx";
import AddFormComments from "./AddFormComments.jsx";
import Modal from "./Modal.jsx";
import "../css/ProductPage.css";

const ProductPage = () => {
  const params = useParams();
  const SERVER = import.meta.env.VITE_SERVER_URL;

  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  const { isSignedIn, user } = useClerk();

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const userEmail = user?.emailAddresses[0]?.emailAddress;

  useEffect(() => {
    setLoading(true);

    if (!userEmail) return;

    axios
      .get(`${SERVER}/users?email=${userEmail}`)
      .then((response) => {
        setUserId(response.data[0]?.id);
        setLoading(false);
        setError(null);
      })
      .catch((e) => {
        console.error(e);
        setError(e);
        setLoading(false);
      });

    axios
      .get(`${SERVER}/products/${params.id}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setError(e);
        setLoading(false);
      });
  }, [SERVER, params.id, userEmail]);

  if (loading) return <Loading />;

  const updateProductReviews = (updatedReviews) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      review: updatedReviews,
    }));
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;

    const sum = reviews.reduce(
      (total, review) => total + Number(review.rating),
      0
    );
    return (sum / reviews.length).toFixed(1); // Redondea a 1 decimal
  };

  return (
    <>
      <div className="container-product">
        <div className="product-content">
          <div className="product-image">
            <img
              src={`../${product.image}`}
              alt="Imagen del producto"
              className="img-product"
            />
          </div>

          <div className="product-info">
            <h1 className="product-title">{FirstLetterUpper(product.name)}</h1>

            <div className="product-raiting">
              <strong>Puntuacion: </strong>{" "}
              {calculateAverageRating(product.review)}
            </div>

            <p className="info-product">
              <strong>Descripción:</strong> {product.description}
            </p>
            <p className="info-product">
              <strong>Categoría:</strong>{" "}
              {FirstLetterUpper(Translator(product.category))}
            </p>
            <p className="info-product">
              <strong>Cantidad disponible:</strong> {product.stock}
            </p>

            <p className="info-product">
              <strong>Precio:</strong> {product.price}$
            </p>

            {isSignedIn ? (
              <button className="button-add">Agregar al carrito</button>
            ) : (
              <p className="message-no-login">
                Primero debes iniciar sesión para agregar al carrito
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="comments-section">
        <h2 className="comments-title">Comentarios</h2>

        {product.review &&
          product.review.map((info, index) => {
            return <Comments key={index} info={info} product={product} />;
          })}

        {isSignedIn ? (
          <button className="comments-button" onClick={openModal}>
            Agregar comentario
          </button>
        ) : (
          <p className="message-no-login">
            Primero debes iniciar sesión para agregar un comentario
          </p>
        )}
      </div>

      <div className="error-product">{error && <p>{error}</p>}</div>

      <Modal isOpen={isOpen} closeModal={closeModal}>
        <AddFormComments
          userId={userId}
          closeModal={closeModal}
          productId={product.id}
          currentReviews={product.review}
          updateProductReviews={updateProductReviews}
        />
      </Modal>
    </>
  );
};

export default ProductPage;
