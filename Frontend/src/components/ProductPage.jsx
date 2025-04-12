import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "./Loading";
import axios from "axios";
import FirstLetterUpper from "../helper/FirstLetterUpper";
import Translator from "../helper/Translator.js";
import Star from "./Star.jsx";

const ProductPage = () => {
  const params = useParams();
  const SERVER = import.meta.env.VITE_SERVER_URL;

  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    axios
      .get(`${SERVER}/products/${params.id}`)
      .then((response) => {
        console.log(response.data);
        setProduct(response.data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setError(e);
        setLoading(false);
      });
  }, [SERVER, params.id]);

  if (loading) return <Loading />;

  return (
    <>
      <br />
      <br />
      <br />
      <div className="header-product">
        <img src={`../${product.image}`} alt="Imagen del producto" />
        <h1>
          {product.id}.{FirstLetterUpper(product.name)}
        </h1>
        <Star />

        <p>Description: {product.description}</p>
        <p>Categoria: {FirstLetterUpper(Translator(product.category))}</p>
        <p>Stock: {product.stock}</p>

        <button>Agregar al carrito</button>
      </div>

      <div className="comentarios">
        {product.reviews &&
          product.reviews.map((info) => {
            return (
              <ul>
                <li key={info.userId}>
                  <label>
                    Usuario id: {info.userId}
                    <p>{info.review}</p>
                  </label>
                </li>
              </ul>
            );
          })}
      </div>
      <div>{error && <p>{error}</p>}</div>
    </>
  );
};

export default ProductPage;
