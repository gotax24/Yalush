import { useContext } from "react";
import { Context } from "../context/UserContext.jsx";
import cart from "../assets/cart.svg";
import sadPerson from "../assets/sadPerson.svg";
import Loading from "./Loading.jsx";
import "../css/Cart.css";

const Cart = () => {
  const { userContext, error, loading } = useContext(Context);
  if (loading) return <Loading />;

  return (
    <>
      <header className="header-cart">
        <img src={cart} alt="Imagen de un carro" className="img-cart" />
        <h1 className="title-cart">Tu carrito de compra</h1>
      </header>
      <main className="container-car">
        <div className="container-products-cart">
          <h1 className="title-products-cart">Productos en el carrito</h1>
          {userContext?.cart?.length > 0 ? (
            userContext.cart.map((product, index) => (
              <div key={index} className="container-product-cart">
                <img
                  src={`../${product.image}`}
                  alt="Imagen del producto"
                  className="img-product-cart"
                />
                <div className="product-info-cart">
                  <h1 className="product-title-cart">{product.name}</h1>
                  <p className="info-product-cart">
                    <strong>Descripción:</strong> {product.description}
                  </p>
                  <p className="info-product-cart">
                    <strong>Precio:</strong> ${product.price}
                  </p>
                  <p className="info-product-cart">
                    <strong>Cantidad en el carrito:</strong> {product.quantity}
                  </p>
                </div>
                <div className="container-button-cart">
                  <button className="button-delete-cart">Eliminar</button>
                </div>
                <div className="container-total-cart">
                  <p className="total-product-cart">
                    Total: ${product.price * product.quantity}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="container-empty-cart">
              <h1 className="title-empty-cart">El carrito está vacío</h1>
              <img src={sadPerson} alt="Persona triste" />
              <p className="text-empty-cart">Agrega productos a tu carrito.</p>
            </div>
          )}

          {userContext?.cart?.length > 0 && (
            <div className="container-total-cart">
              <h1>Total de productos: {userContext.cart.length}</h1>
              <h2 className="title-total-cart">Total de la compra</h2>
              <p className="total-cart">
                $
                {userContext.cart.reduce((acumulador, product) => {
                  return acumulador + product.price * product.quantity;
                }, 0)}
              </p>
            </div>
          )}
        </div>
      </main>
      {error && <p className="error-cart">{error.mesagge}</p>}
    </>
  );
};

export default Cart;
