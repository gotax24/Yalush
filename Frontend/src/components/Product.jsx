import PropTypes from "prop-types";
import { Link } from "react-router-dom";
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
                src={image || "../public/img/no-image.jpg"}
                alt="Imagen del product"
              />
            </div>
            <div className="info-card">
              <h1 className="title-product">{name}</h1>
              <p className="price-product">Precio: {price}$</p>
              <p className="category-product">Categoria: {category}</p>
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
