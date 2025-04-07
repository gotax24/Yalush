import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "./Loading";
import Product from "./Product";
import "../css/Layout.css"

const Layout = () => {
  const SERVER = import.meta.env.VITE_SERVER_URL;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

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
  }, [SERVER]);

  if (loading) return <Loading />;
  return (
    <>
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
    </>
  );
};

export default Layout;
