import { useState, useEffect, useContext } from "react";
import { Context } from "../context/UserContext.jsx";
import { Link } from "react-router-dom";
import FirstLetterUpper from "../helpers/FirstLetterUpper.js";
import sadPerson from "../assets/sadPerson.svg";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "./Loading.jsx";
import { deleteProduct } from "../helpers/DeleteProduct.js";
import "../css/Fav.css";

const FavPage = () => {
  const { userContext, error, loading } = useContext(Context);
  const [fav, setFav] = useState([]);
  const [errorFav, setErrorFav] = useState();

  useEffect(() => {
    if (userContext?.favorite) {
      setFav(userContext.favorite);
    }
  }, [userContext]);

  if (loading) return <Loading />;

  return (
    <main className="container-main">
      <h1 className="fav-title">Tus favoritos</h1>

      {fav?.length > 0 ? (
        <article className="container-products-fav">
          <AnimatePresence>
            {fav.map((product, index) => (
              <motion.section
                key={product.productId || index}
                className="product-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  className="product-img"
                  src={product.image}
                  alt={product.nameProduct}
                />
                <div className="product-info">
                  <p>
                    <strong>Nombre:</strong>{" "}
                    {FirstLetterUpper(product.nameProduct)}
                  </p>
                  <p>
                    <strong>Descripción:</strong> {product.description}
                  </p>
                  <p>
                    <strong>Precio:</strong> ${product.price}
                  </p>
                  <div className="product-buttons">
                    <button
                      onClick={() =>
                        deleteProduct(
                          product,
                          setFav,
                          setErrorFav,
                          fav,
                          userContext,
                          "favorite"
                        )
                      }
                    >
                      ❌ Eliminar
                    </button>

                    <Link to={`/products/${product.productId}`}>
                      Ver el producto{" "}
                    </Link>
                  </div>
                </div>
              </motion.section>
            ))}
          </AnimatePresence>
        </article>
      ) : (
        <div className="container-no">
          <h2>No tienes ningún favorito</h2>
          <img src={sadPerson} alt="Persona triste" />
          <Link to="/products">Haz clic aquí para ver los productos</Link>
        </div>
      )}

      <div className="container-error">
        {error && <p>{error.message}</p>}
        {errorFav && <p>{errorFav.message}</p>}
      </div>
    </main>
  );
};

export default FavPage;
