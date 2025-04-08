import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "./Loading";
import Product from "./Product";
import "../css/Layout.css";

const Layout = () => {
  const SERVER = import.meta.env.VITE_SERVER_URL;
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(false);
  //const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    if (category) {
      axios
        .get(`${SERVER}/products?category=${category}`)
        .then((response) => {
          setLoading(false);
          setProducts(response.data);
        })
        .catch((e) => {
          console.error(e);
          setError(e);
          setLoading(false);
        });
    } else {
      axios
        .get(`${SERVER}/products`)
        .then((response) => {
          setLoading(false);
          setProducts(response.data);
        })
        .catch((e) => {
          console.error(e);
          setError(e);
          setLoading(false);
        });
    }
  }, [SERVER, category]);

  if (loading) return <Loading />;

  return (
    <>
      <div className="container-layout">
        <div className="container-search">
          <input type="search" name="" placeholder="Busca tu producto aqui" />
        </div>

        <div className="container-main">
          <div className="container-category">
            <h2 className="title-category">Categorias: </h2>
            <fieldset className="container-labels">
              <label className="category-item">
                <input
                  type="radio"
                  name="category"
                  id="pillows"
                  onChange={() => setCategory("pillows")}
                  checked={category === "pillows"}
                />
                Almohadas
              </label>
              <label className="category-item">
                <input
                  type="radio"
                  name="category"
                  id="bags"
                  onChange={() => setCategory("bags")}
                  checked={category === "bags"}
                />
                Bolsos
              </label>
              <label className="category-item">
                <input
                  type="radio"
                  name="category"
                  id="keychains"
                  onChange={() => setCategory("keychains")}
                  checked={category === "keychains"}
                />
                Llaveros
              </label>
              <label className="category-item">
                <input
                  type="radio"
                  name="category"
                  id="swimwear"
                  onChange={() => setCategory("swimwear")}
                  checked={category === "swimwear"}
                />
                Traje de baños
              </label>
              <label className="category-item">
                <input
                  type="radio"
                  name="category"
                  id="dress"
                  onChange={() => setCategory("dress")}
                  checked={category === "dress"}
                />
                Vestidos
              </label>
              <label className="category-item">
                <input
                  type="radio"
                  name="category"
                  id="other"
                  onChange={() => setCategory("other")}
                  checked={category === "other"}
                />
                Mas cosas
              </label>
            </fieldset>
            <button
              className="button-category"
              onClick={() => setCategory(false)}
            >
              Quitar filtros
            </button>
          </div>
          <div className="container-products">
            {products &&
              products.map(({ id, name, image, price, category }) => {
                return (
                  <Product
                    key={id}
                    id={id}
                    name={name}
                    image={image}
                    price={price}
                    category={category}
                  />
                );
              })}

            {error && <p>{error}</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
