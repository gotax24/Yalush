import axios from "axios";

export const deleteProduct = (
  product,
  setState1,
  setError,
  state,
  userContext,
  field
) => {
  const SERVER = import.meta.env.VITE_SERVER_URL;

  const newArray = state.filter((item) => item.productId !== product.productId);

  axios
    .patch(`${SERVER}/users/${userContext?.id}`, { [field]: newArray })
    .then((response) => {
      setState1(newArray);
      setError(null);
      console.log(`${field} actualizados `, response.data);
    })
    .catch((e) => {
      setError(e.message);
      console.error(e.message);
    });

  return { setState1, setError, state };
};
