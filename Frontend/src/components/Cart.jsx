import { useContext, useEffect, useState } from "react";
import { Context } from "../context/UserContext.jsx";
import { Link } from "react-router-dom";
import axios from "axios";
import FirstLetterUpper from "../helper/FirstLetterUpper.js";
import sadPerson from "../assets/sadPerson.svg";
import Loading from "./Loading.jsx";
import "../css/Cart.css";
import Checkout from "./Checkout.jsx";

const Cart = () => {
  const { userContext, error, loading } = useContext(Context);
  const [cart, setCart] = useState([]);
  const [errorCart, setErrorCart] = useState(null);
  const SERVER = import.meta.env.VITE_SERVER_URL;
  let totalUsd = 0;

  useEffect(() => {
    const { cart: userCart } = userContext || {};
    if (Array.isArray(userCart)) {
      setCart(userCart);
    } else {
      setCart([]);
    }
  }, [userContext]);

  const deleteProduct = (product) => {
    const newCart = cart.filter((item) => item.productId !== product.productId);

    axios
      .patch(`${SERVER}/users/${userContext?.id}`, { cart: newCart })
      .then((response) => {
        setCart(newCart);
        console.log("Carrito actualizado: ", response.data);
      })
      .catch((e) => {
        console.error(e);
        setErrorCart(e);
      });
  };

  if (loading) return <Loading />;

  cart?.reduce((acumulador, product) => {
    totalUsd = acumulador + product.price * product.quantity;
    return totalUsd;
  }, 0);

  return (
    <>
      <main className="container-car">
        <div className="container-products-cart">
          <h1 className="title-products-cart">Productos en el carrito</h1>
          {cart?.length > 0 ? (
            cart?.map((product, index) => (
              <div key={index} className="container-product-cart">
                <img
                  src={`../${product.image}`}
                  alt="Imagen del producto"
                  className="img-product-cart"
                />
                <div className="product-info-cart">
                  <h1 className="product-title-cart">
                    {FirstLetterUpper(product.nameProduct)}
                  </h1>
                  <p className="info-product-cart">
                    <strong>Precio:</strong> ${product.price}
                  </p>
                  <p className="info-product-cart">
                    <strong>Cantidad en el carrito:</strong> {product.quantity}
                  </p>
                </div>
                <div className="container-total-cart">
                  <p className="total-product-cart">
                    Total: ${product.price * product.quantity}
                  </p>
                </div>
                <div className="container-button-cart">
                  <button
                    onClick={() =>
                      deleteProduct(
                        product,
                        setCart,
                        setErrorCart,
                        cart,
                        userContext,
                        "cart"
                      )
                    }
                    className="button-delete-cart"
                  >
                    X
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="container-empty-cart">
              <h1 className="title-empty-cart">El carrito está vacío</h1>
              <img src={sadPerson} alt="Persona triste" />
              <p className="text-empty-cart">Agrega productos a tu carrito.</p>
              <Link to="/products">Entra aqui para ver los productos</Link>
            </div>
          )}

          {cart?.length > 0 && (
            <div className="container-total-cart">
              <h1>Total de productos: {cart?.length}</h1>
            </div>
          )}
        </div>

        <div className="checkout-wrapper">
          <Checkout total={totalUsd} setCart={setCart}/>
        </div>
      </main>
      {errorCart && <p className="error-cart">{error.mesagge}</p>}
      {error && <p className="error-cart">{error.mesagge}</p>}
    </>
  );
};

export default Cart;
