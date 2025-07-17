import axios from "axios";
import { useState } from "react";

const ButtonAddFavorite = ({
  productPage,
  idUser,
  favorite,
  setFavorite,
  setUserContext,
  userContext,
}) => {
  const SERVER = import.meta.env.VITE_SERVER_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Verificar si el producto ya está en favoritos
  const isProductFavorite = favorite.some(
    (item) => Number(item.productId) === Number(productPage.id)
  );

  const buildFavorite = (product) => ({
    productId: product.id,
    nameProduct: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
  });

  const handleToggleFavorite = async () => {
    setError(null);
    setLoading(true);

    try {
      let updatedFavorites;

      if (isProductFavorite) {
        // Si ya está en favoritos, lo removemos
        updatedFavorites = favorite.filter(
          (item) => Number(item.productId) !== Number(productPage.id)
        );
      } else {
        // Si no está en favoritos, lo agregamos
        updatedFavorites = [...favorite, buildFavorite(productPage)];
      }

      // Actualizamos los favoritos en el servidor
      await axios.patch(`${SERVER}/users/${idUser}`, {
        favorite: updatedFavorites,
      });

      // Actualizamos el estado local y el contexto
      setFavorite(updatedFavorites);
      setUserContext({
        ...userContext,
        favorite: updatedFavorites,
      });
    } catch (error) {
      setError("Error al actualizar favoritos.");
      console.error("Error al actualizar favoritos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-actions">
      <button
        onClick={handleToggleFavorite}
        className="button-favorite"
        disabled={loading}
      >
        {isProductFavorite ? (
          <span className="fav-yes">😍 mi favorito</span>
        ) : (
          <span className="fav-no">🤨 no me gusta</span>
        )}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ButtonAddFavorite;
