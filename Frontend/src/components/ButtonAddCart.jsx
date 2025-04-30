import axios from "axios";
import { useState } from "react";

const ButtonAddCart = ({
  quantity,
  productPage,
  idUser,
  cart,
  updatedStock,
  setCart,
}) => {
  const SERVER = import.meta.env.VITE_SERVER_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setLoading(true);

    const quantityNumber = Number(quantity);

    // Validate quantity
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

    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(
      (item) => Number(item.productId) === productPage.id
    );
    // Create a deep copy of the cart to avoid reference issues
    let updatedCart = [...cart];

    // If product exists, update quantity; otherwise add new product
    if (existingProductIndex !== -1) {
      // Calculate new quantity
      const currentQuantity = updatedCart[existingProductIndex].quantity;
      const newQuantity = currentQuantity + quantityNumber;

      // Make sure new quantity doesn't exceed stock
      const finalQuantity = Math.min(newQuantity, productPage.stock);

      // Create a new object to ensure React detects the change
      updatedCart[existingProductIndex] = {
        ...updatedCart[existingProductIndex],
        quantity: finalQuantity,
      };

      console.log("Updating existing product:", {
        currentQuantity,
        addedQuantity: quantityNumber,
        newQuantity: finalQuantity,
      });
    } else {
      // Add new product to cart
      const newProduct = {
        productId: productPage.id,
        nameProduct: productPage.name,
        price: productPage.price,
        image: productPage.image,
        quantity: quantityNumber,
      };

      updatedCart.push(newProduct);
      console.log("Adding new product:", newProduct);
    }

    // Update cart in server
    axios
      .patch(`${SERVER}/users/${idUser}`, { cart: updatedCart })
      .then((response) => {
        setCart(updatedCart);
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
  };

  return (
    <>
      <button onClick={handleSubmit} className="button-add" disabled={loading}>
        {loading ? "Agregando..." : "Agregar al carrito"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
};

export default ButtonAddCart;
