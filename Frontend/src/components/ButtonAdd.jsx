import axios from "axios";
import { useContext, useState } from "react";
import { Context } from "../context/UserContext";

const ButtonAdd = ({
  quantity,
  productPage,
  idUser,
  cart,
  updatedStock,
  setCart,
  favorite,
  setFavorite,
}) => {
  const SERVER = import.meta.env.VITE_SERVER_URL;
  const [loading, setLoading] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);
  const [error, setError] = useState(null);
  const { setUserContext, userContext } = useContext(Context);

  // Verificar si el producto ya está en favoritos
  const isProductFavorite = favorite.some(
    (item) => Number(item.productId) === productPage.id
  );

  const isValidQuantity = (number, stock) => {
    const num = Number(number);
    return num > 0 && Number.isInteger(num) && num <= stock;
  };

  const buildCartProduct = (product, quantity) => ({
    productId: product.id,
    nameProduct: product.name,
    price: product.price,
    image: product.image,
    quantity: Number(quantity),
  });

  const buildFavorite = (product) => ({
    productId: product.id,
    nameProduct: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
  });

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!isValidQuantity(quantity, productPage.stock)) {
        setError("Cantidad inválida o mayor al stock disponible.");
        return;
      }

      const quantityNumber = Number(quantity);
      const newStock = productPage.stock - quantityNumber;

      // Verificamos si el producto existe en el cart
      const existingProductIndex = cart.findIndex(
        (item) => Number(item.productId) === productPage.id
      );

      // Creamos una copia del carrito
      let updatedCart = [...cart];

      // Si el producto existe actualizamos la cantidad
      if (existingProductIndex !== -1) {
        // Calculamos la nueva cantidad
        const currentQuantity = updatedCart[existingProductIndex].quantity;
        const newQuantity = currentQuantity + quantityNumber;

        // Nos aseguramos que no sobrepase la cantidad disponible
        const finalQuantity = Math.min(newQuantity, productPage.stock);

        // Creamos un nuevo objeto para que react detecte el cambio
        updatedCart[existingProductIndex] = {
          ...updatedCart[existingProductIndex],
          quantity: finalQuantity,
        };

        console.log("Actualizamos producto existente:", {
          currentQuantity,
          addedQuantity: quantityNumber,
          newQuantity: finalQuantity,
        });
      } else {
        // Agregamos un nuevo producto si no existe
        updatedCart.push(buildCartProduct(productPage, quantity));
        console.log(
          "Agregado nuevo producto:",
          buildCartProduct(productPage, quantity)
        );
      }

      // Actualizamos el carrito en el servidor
      await axios.patch(`${SERVER}/users/${idUser}`, { cart: updatedCart });
      await axios.patch(`${SERVER}/products/${productPage.id}`, {
        stock: newStock,
      });

      setCart(updatedCart);
      setUserContext({
        ...userContext,
        cart: updatedCart,
      });
      updatedStock(newStock);
    } catch (error) {
      console.error("Error al actualizar el carrito:", error);
      setError("Error al agregar al carrito.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    setError(null);
    setLoadingFav(true);

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
      setLoadingFav(false);
    }
  };

  return (
    <div className="product-actions">
      <button
        onClick={handleAddToCart}
        className="button-add"
        disabled={loading}
      >
        {loading ? "Agregando..." : "Agregar al carrito"}
      </button>

      <button
        onClick={handleToggleFavorite}
        className="button-favorite"
        disabled={loadingFav}
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

export default ButtonAdd;
