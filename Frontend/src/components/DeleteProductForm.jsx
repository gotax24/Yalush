import { useForm } from "react-hook-form";
import axios from "axios";

const DeleteProductForm = ({closeModal}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const SERVER = import.meta.env.VITE_SERVER_URL;
  const handleDelete = async (data) => {
    const { productId } = data;

    try {
      await axios.delete(`${SERVER}/products/${productId}`);
      console.log("Producto eliminado exitosamente");
      closeModal(); // Cierra el modal después de eliminar
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <>
      <h2>Borrar Producto</h2>
      <form onSubmit={handleSubmit(handleDelete)}>
        <label className="label-del-producto">
          ID del Producto
          <input
            type="number"
            placeholder="Ingrese el ID del producto"
            {...register("productId", {
              required: "El numero del producto es requerido",
              min: {
                value: 1,
                message: "El ID del producto debe ser mayor que 0",
              },
              pattern: {
                value: /^[0-9]+$/,
                message: "El ID del producto debe ser un número",
              },
            })}
          />
        </label>
        <label htmlFor=""></label>
        {errors.productId && <span>{errors.productId.message}</span>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Borrando..." : "Borrar Producto"}
        </button>
      </form>
    </>
  );
};

export default DeleteProductForm;
