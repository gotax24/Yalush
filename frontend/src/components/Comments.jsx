import { useState, useEffect } from "react";
import axios from "axios";

const Comments = ({ info, product }) => {
  const [users, setUsers] = useState({});
  const [error, setError] = useState(null);

  const SERVER = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const getUser = async (id) => {
      try {
        if (users[id]) return; // si ya existe, no lo vuelvas a pedir

        const response = await axios.get(`${SERVER}/users/${id}`);
        setUsers((prev) => ({ ...prev, [id]: response.data }));
      } catch (e) {
        console.error(e);
        setError(e.message);
      }
    };

    // Este useEffect se ejecuta cada vez que las reviews cambien
    // Así pedimos la info de todos los usuarios que hicieron una review
    if (!product.review) return; // Si no hay reviews, salimos

    // Por cada review, llamamos a getUser para obtener al autor
    product.review.forEach((information) => {
      getUser(information.userId);
    });
  }, [product.review, SERVER, users]);

  const userInfo = users[info.userId];

  return (
    <>
      <li className="comments-item">
        {userInfo && (
          <>
            <img
              src={userInfo?.profileImageUrl || "../img-products/no-image.webp"}
              alt="imagen del usuario"
              className="img-perfil-product"
            />
            <div className="comment-right">
              <p className="info-user">
                <span className="comment-user">
                  {userInfo.firstName} {userInfo.lastName}:
                </span>{" "}
                {info.comment}
              </p>
              <p className="comment-rating">Puntuación: {info.rating}</p>
            </div>
          </>
        )}
      </li>
      <hr className="comment-divider" />
      {error && <p>{error}</p>}
    </>
  );
};

export default Comments;
