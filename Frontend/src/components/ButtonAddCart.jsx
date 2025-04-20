import axios from "axios";
import { useState } from "react";

const ButtonAddCart = ({
  quantity,
  idProduct,
  name,
  price,
  image,
  idUser,
  cart = [],
}) => {
  const SERVER = import.meta.env.VITE_SERVER_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const product = {
    productId: idProduct,
    nameProduct: name,
    price: price,
    quantity: quantity,
    image: image,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Verificar si el producto ya está en el carrito
    const existingProduct = cart.find((item) => item.productId === idProduct);
    let updatedCart;

    if (existingProduct) {
      // Si ya existe, actualizamos la cantidad
      updatedCart = cart.map((item) =>
        item.productId === idProduct
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // Si no está, lo agregamos
      updatedCart = [...cart, product];
    }

    axios
      .patch(`${SERVER}/users/${idUser}`, { cart: updatedCart })
      .then((response) => {
        console.log("Carrito actualizado:", response.data);
        setError(null);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setError("Error al agregar al carrito");
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
