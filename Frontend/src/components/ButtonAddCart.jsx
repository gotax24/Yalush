import axios from "axios";
import { useContext, useState } from "react";
import { Context } from "../context/UserContext";

const ButtonAddCart = ({
  quantity,
  productPage,
  idUser,
  cart,
  updatedStock,
  setCart,
  isFavorite,
  favorite,
  setFavorite,
}) => {
  const SERVER = import.meta.env.VITE_SERVER_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setUserContext, userContext } = useContext(Context);
  const isFavoriteText = isFavorite
    ? "Agregar a favoritos"
    : "Agregar al carrito";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null); // Limpiamos el estado del error
    setLoading(true);

    if (isFavorite) {
      const existingProductIndexFav = favorite.findIndex(
        (item) => Number(item.productId) === productPage.id
      );
      
      if (existingProductIndexFav !== -1) {
        setError("Ya el producto existe en tus favoritos ;)");
        setLoading(false);
        return;
      }

      const newFavorite = {
        productId: productPage.id,
        nameProduct: productPage.name,
        description: productPage.description,
        price: productPage.price,
        image: productPage.image,
      };
      
      let updateFavorite = [...favorite, newFavorite];
      console.log("Agregado nuevo producto fav: ", newFavorite);

      axios
        .patch(`${SERVER}/users/${idUser}`, { favorite: updateFavorite })
        .then((response) => {
          setUserContext({
            ...userContext,
            favorite: updateFavorite,
          });
          setFavorite(response.data);
          setLoading(false);
          setError(null);
        })
        .catch((e) => {
          console.error(e);
          setError(e);
        });
    } else {
      const quantityNumber = Number(quantity);

      // Validamos cantidad
      const isValidQuantity =
        quantityNumber > 0 &&
        Number.isInteger(quantityNumber) &&
        quantityNumber <= productPage.stock;

      if (!isValidQuantity) {
        setError("Cantidad inválida o mayor al stock disponible.");
        setLoading(false);
        return;
      }

      const newStock = productPage.stock - quantityNumber;

      // Verificamos si el producto existe en el cart
      const existingProductIndexCart = cart.findIndex(
        (item) => Number(item.productId) === productPage.id
      );
      // Creamos una copia del carrito
      let updatedCart = [...cart];

      // Si el producto existe actualizamos la cantidad
      if (existingProductIndexCart !== -1) {
        // Calculamos la nueva cantidad
        const currentQuantity = updatedCart[existingProductIndexCart].quantity;
        const newQuantity = currentQuantity + quantityNumber;

        // Nos aseguramos que no sobrepase la cantidad disponible
        const finalQuantity = Math.min(newQuantity, productPage.stock);

        // Creamos un nuevo objeto para que react dectete el cambio
        updatedCart[existingProductIndexCart] = {
          ...updatedCart[existingProductIndexCart],
          quantity: finalQuantity,
        };

        console.log("Actualizamos producto existente: ", {
          currentQuantity,
          addedQuantity: quantityNumber,
          newQuantity: finalQuantity,
        });
      } else {
        // Agregamos un nuevo producto si no existe
        const newProduct = {
          productId: productPage.id,
          nameProduct: productPage.name,
          price: productPage.price,
          image: productPage.image,
          quantity: quantityNumber,
        };

        updatedCart.push(newProduct);
        console.log("Agregado nuevo producto:", newProduct);
      }

      // Actualizamos el carrito en el servidor
      axios
        .patch(`${SERVER}/users/${idUser}`, { cart: updatedCart })
        .then((response) => {
          setCart(updatedCart);
          setUserContext({
            ...userContext,
            cart: updatedCart,
          });
          console.log("Carrito actualizado:", response.data);
          return axios.patch(`${SERVER}/products/${productPage.id}`, {
            stock: newStock,
          });
        })
        .then(() => {
          updatedStock(newStock);
        })
        .catch((e) => {
          console.error("Error updating cart:", e);
          setError("Error al agregar al carrito.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <>
      <button onClick={handleSubmit} className="button-add" disabled={loading}>
        {loading ? "Agregando..." : isFavoriteText}
      </button>
      {error && <p style={{ color: "white" }}>{error}</p>}
    </>
  );
};

export default ButtonAddCart;
