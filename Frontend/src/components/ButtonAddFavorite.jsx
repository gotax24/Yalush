import axios from "axios";
import { useContext, useState } from "react";
import { Context } from "../context/UserContext";

const ButtonAddFavorite = ({
  productPage,
  idUser,
  favorite,
  setFavorite,
}) => {
  const SERVER = import.meta.env.VITE_SERVER_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setUserContext, userContext } = useContext(Context);

  // Verificar si el producto ya está en favoritos
  const isProductFavorite = favorite.some(
    (item) => Number(item.productId) === productPage.id
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
          (item) => Number(item.productId) !== productPage.id
        );
        console.log("Producto eliminado de favoritos:", productPage.id);
      } else {
        // Si no está en favoritos, lo agregamos
        updatedFavorites = [...favorite, buildFavorite(productPage)];
        console.log(
          "Producto agregado a favoritos:",
          buildFavorite(productPage)
        );
      }

      // Actualizamos los favoritos en el servidor
      await axios.patch(`${SERVER}/users/${idUser}`, {
        favorite: updatedFavorites,
      });

      // Actualizamos el estado local
      setFavorite(updatedFavorites);
      setUserContext({
        ...userContext,
        favorite: updatedFavorites,
      });
    } catch (error) {
      console.error("Error al actualizar favoritos:", error);
      setError("Error al actualizar favoritos.");
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
          <span className="fav-yes">😍</span>
        ) : (
          <span className="fav-no">🤨</span>
        )}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ButtonAddFavorite;
