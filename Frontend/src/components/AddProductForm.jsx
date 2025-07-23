import axios from "axios";
import { useForm } from "react-hook-form";
import useLastId from "../hooks/useLastId.jsx";
import SkuGenerator from "../helpers/SkuGenerator.js";
import "../css/AddProductForm.css";
import ProductForm from "./ProductForm.jsx";

const AddProductForm = ({ closeModal }) => {
  const { lastId } = useLastId();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm();

  const SERVER = import.meta.env.VITE_SERVER_URL;
  const newDate = new Date();

  const onSubmit = async (data) => {
    const nextNum = lastId + 1;
    const sku = SkuGenerator(data, lastId);

    const newProduct = {
      ...data,
      sku,
      dateAdded: newDate.toISOString(),
      reviews: [],
      id: nextNum,
    };

    try {
      await axios.post(`${SERVER}/products`, newProduct);
      reset();
      closeModal();
    } catch (error) {
      setError("root", {
        message: "Error al agregar el producto",
      });
      console.error("Error adding product:", error);
    }
  };

  return (
    <>
      <div className="container-add-product">
        <div className="header-add-product">
          <h1>Agregar producto</h1>
        </div>
        <ProductForm
          formFunction={onSubmit}
          isSubmitting={isSubmitting}
          errors={errors}
          register={register}
          handleSubmit={handleSubmit}
          title="Agregar Producto"
          submitLabel="Agregar Producto"
          reset={reset}
          isEditMode={false}
          setError={setError}
        />
      </div>
    </>
  );
};

export default AddProductForm;
