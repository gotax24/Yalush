import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../context/UserContext.jsx";
import axios from "axios";
import Translator from "../helper/Translator.js";
import Loading from "./Loading.jsx";
import FirstLetterUpper from "../helper/FirstLetterUpper.js";
import Comments from "./Comments.jsx";
import AddFormComments from "./AddFormComments.jsx";
import Modal from "./Modal.jsx";
import ButtonAddCart from "./ButtonAddCart.jsx";
import "../css/ProductPage.css";

const ProductPage = () => {
  const params = useParams();
  const SERVER = import.meta.env.VITE_SERVER_URL;

  const { userContext, errorContext, loadingContext } = useContext(Context);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [product, setProduct] = useState({});
  const [cartUser, setCartUser] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [favorite, setFavorite] = useState([]);

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  //Busca el correo del usuario logueado
  const userId = userContext?.id;

  useEffect(() => {
    setLoading(true);
    setError(null);

    //Hace la peticion al servidor para obtener el producto
    const fetchProduct = axios.get(`${SERVER}/products/${params.id}`);

    if (userId) {
      // Si el usuario está logueado, obtiene su información y el producto
      fetchProduct
        .then((productResponse) => {
          setCartUser(userContext.cart || []);
          setProduct(productResponse.data);
          setError(null);
          setFavorite(userContext.favorite || []);
        })
        .catch((e) => {
          console.error(e);
          setError(e);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // Si el usuario no está logueado, solo obtiene el producto
      fetchProduct
        .then((productResponse) => {
          setProduct(productResponse.data);
          setError(null);
        })
        .catch((e) => {
          console.error(e);
          setError(e);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [SERVER, params.id, userId, userContext]);

  if (loading || loadingContext) return <Loading />;

  const updateProductReviews = (updatedReviews) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      review: updatedReviews,
    }));
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return "Sin calificacion";

    const sum = reviews.reduce(
      (total, review) => total + Number(review.rating),
      0
    );
    return (sum / reviews.length).toFixed(1); // Redondea a 1 decimal
  };

  const numberOfRatings = product.review?.length ? product.review.length : 0;

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
              <strong>Puntuacion: </strong>
              {calculateAverageRating(product.review)} {`(${numberOfRatings})`}
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

            {favorite && <></>}

            {product && userId ? (
              <>
                <label className="label-quantity">
                  Cantidad:
                  <input
                    type="number"
                    min={1}
                    max={product.stock}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="input-quantity"
                  />
                </label>

                <ButtonAddCart
                  quantity={quantity}
                  productPage={product}
                  idUser={userId}
                  cart={cartUser}
                  setCart={setCartUser}
                  updatedStock={(newStock) =>
                    setProduct((prev) => ({
                      ...prev,
                      stock: newStock,
                    }))
                  }
                />
              </>
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

        {userId ? (
          <button className="comments-button" onClick={openModal}>
            Agregar comentario
          </button>
        ) : (
          <p className="message-no-login">
            Primero debes iniciar sesión para agregar un comentario
          </p>
        )}
      </div>

      <div className="error-product">
        {error && <p>{error.message}</p>}
        {errorContext && <p>{errorContext.message}</p>}
      </div>

      {isOpen && userId && product && (
        <Modal isOpen={isOpen} closeModal={closeModal}>
          <AddFormComments
            userId={userId}
            closeModal={closeModal}
            productId={product?.id}
            currentReviews={product?.review}
            updateProductReviews={updateProductReviews}
          />
        </Modal>
      )}
    </>
  );
};

export default ProductPage;
