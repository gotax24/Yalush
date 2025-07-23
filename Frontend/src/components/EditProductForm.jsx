import axios from "axios";
import { useForm } from "react-hook-form";
import ProductForm from "./ProductForm";

const EditProductForm = ({ closeModal }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    setError,
  } = useForm();
  const SERVER = import.meta.env.VITE_SERVER_URL;

  const onSubmit = async (data) => {
    const image = data.image ? `img-products/${data.image}` : "";
    try {
      await axios.put(`${SERVER}/products/${data.productId}`, {
        ...data,
        image,
      });
      closeModal();
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  return (
    <>
      <h2>Editar Producto</h2>
      <ProductForm
        formFunction={onSubmit}
        isSubmitting={isSubmitting}
        errors={errors}
        register={register}
        handleSubmit={handleSubmit}
        title="Editar Producto"
        submitLabel="Guardar Cambios"
        reset={reset}
        isEditMode={true}
        setValue={setValue}
        setError={setError}
      />
    </>
  );
};

export default EditProductForm;
