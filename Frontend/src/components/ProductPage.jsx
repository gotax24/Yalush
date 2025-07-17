import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { useContext } from "react";
import { Context } from "../context/UserContext.jsx";
import Loading from "./Loading.jsx";
import axios from "axios";
import FirstLetterUpper from "../helpers/FirstLetterUpper.js";
import Translator from "../helpers/Translator.js";
import Comments from "./Comments.jsx";
import AddFormComments from "./AddFormComments.jsx";
import Modal from "./Modal.jsx";
import "../css/ProductPage.css";
import ButtonAddFavorite from "./ButtonAddFavorite.jsx";
import ButtonAddCart from "./ButtonAddCart.jsx";

const ProductPage = () => {
  const params = useParams();
  const SERVER = import.meta.env.VITE_SERVER_URL;

  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [userPage, setUserPage] = useState(null);
  const [quantity, setQuantity] = useState(1); // Inicializado en 1 para mejor UX
  const [cartUser, setCartUser] = useState([]);
  const [favoriteUser, setFavoriteUser] = useState([]);

  const { userContext } = useContext(Context);
  const { isSignedIn, user } = useClerk();

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  //Busca el correo del usuario logueado
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  useEffect(() => {
    setLoading(true);
    setError(null);

    //Hace la peticion al servidor para obtener el producto
    const fetchProduct = axios.get(`${SERVER}/products/${params.id}`);

    if (userEmail) {
      // Verifica si el usuario está logueado y obtiene su información
      const fetchUser = axios.get(`${SERVER}/users?email=${userEmail}`);
      // Si el usuario está logueado, obtiene su información y el producto
      Promise.all([fetchUser, fetchProduct])
        .then(([userResponse, productResponse]) => {
          const user = userResponse.data[0];
          setUserPage(user);
          // Inicializar el carrito y favoritos con los datos del usuario
          setCartUser(user.cart || []);
          setFavoriteUser(user.favorite || []);
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
  }, [SERVER, params.id, userEmail]);

  // Actualizar el carrito y favoritos cuando cambie userContext
  useEffect(() => {
    if (userContext) {
      setCartUser(userContext.cart || []);
      setFavoriteUser(userContext.favorite || []);
    }
  }, [userContext]);

  if (loading) return <Loading />;

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

            {product && isSignedIn && userPage ? (
              <>
                <label className="label-quantity">
                  Cantidad:
                  <input
                    type="number"
                    min={1}
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="input-quantity"
                  />
                </label>

                <ButtonAddFavorite
                  productPage={product}
                  idUser={userPage.id}
                  favorite={favoriteUser}
                  setFavorite={setFavoriteUser}
                />
                <ButtonAddCart
                  quantity={quantity}
                  productPage={product}
                  idUser={userPage.id}
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

      <div className="error-product">{error && <p>{error.message}</p>}</div>

      {isOpen && userPage && product && (
        <Modal isOpen={isOpen} closeModal={closeModal}>
          <AddFormComments
            userId={userPage.id}
            closeModal={closeModal}
            productId={product.id}
            currentReviews={product.review}
            updateProductReviews={updateProductReviews}
          />
        </Modal>
      )}
    </>
  );
};

export default ProductPage;
