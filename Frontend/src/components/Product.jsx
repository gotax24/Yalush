import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import FirstLetterUpper from "../helpers/FirstLetterUpper.js";
import  Translator  from "../helpers/Translator.js";
import "../css/Product.css";

const Product = ({ id, name, image, price, category }) => {
  return (
    <>
      <Link to={`${id}`}>
        <div className="card">
          <div className="card2">
            <div className="container-image-producto">
              <img
                className="img-product"
                src={image || "../img-products/no-image.webp"}
                alt="Imagen del product"
              />
            </div>
            <div className="info-card">
              <h1 className="title-product">{FirstLetterUpper(name)}</h1>
              <p className="price-product">Precio: {price}$</p>
              <p className="category-product">
                Categoria: {FirstLetterUpper(Translator(category))}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

Product.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
};

export default Product;
