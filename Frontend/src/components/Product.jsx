import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import capitalizeFirstLetter from "../helper/FirstLetterUpper";
import "../css/Product.css";

const Product = ({ id, name, image, price, category }) => {
  return (
    <>
      <Link to={`products/item/${id}`}>
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
              <h1 className="title-product">{capitalizeFirstLetter(name)}</h1>
              <p className="price-product">Precio: {price}$</p>
              <p className="category-product">
                Categoria: {capitalizeFirstLetter(category)}
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
