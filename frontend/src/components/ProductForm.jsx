import axios from "axios";

const category = ["pillows", "bags", "keychains", "swimwear", "dress", "other"];

const ProductForm = ({
  formFunction,
  isSubmitting,
  errors,
  register,
  handleSubmit,
  title,
  submitLabel,
  reset,
  isEditMode,
  setValue,
  setError,
}) => {
  const SERVER = import.meta.env.VITE_SERVER_URL;

  // Trae el producto y rellena todos los campos
  const getProduct = async (productId) => {
    try {
      const response = await axios.get(`${SERVER}/products/${productId}`);
      const product = response.data;
      // Rellena todos los campos del formulario
      Object.keys(product).forEach((key) => {
        setValue(key, product[key]);
      });
    } catch (error) {
      setError("root", {
        type: "manual",
        message: "Error getting product",
      });
      console.error("Error getting product:", error);
      reset();
    }
  };

  return (
    <div className="container-add-product">
      <div className="header-add-product">
        <h1>{title}</h1>
      </div>
      <div className="container-content-add-product">
        <form onSubmit={handleSubmit(formFunction)}>
          {isEditMode && (
            <label>
              ID del Producto
              <input
                type="number"
                placeholder="Ingrese el ID del producto"
                {...register("productId", {
                  required: "El ID del producto es requerido",
                  min: { value: 1, message: "El ID debe ser mayor que 0" },
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "El ID debe ser un número",
                  },
                  onChange: (e) => {
                    const productId = e.target.value;
                    if (productId) getProduct(productId);
                    else reset();
                  },
                })}
              />
              {errors?.productId && <span>{errors.productId.message}</span>}
            </label>
          )}

          <label className="label-form-add">
            Nombre del producto
            <input
              type="text"
              placeholder="Nombre del producto"
              {...register("name", {
                required: "El nombre esta vacio",
                minLength: {
                  value: 5,
                  message: "El nombre debe tener mas de 5 careceteres",
                },
                maxLength: {
                  value: 50,
                  message: "El nombre no puede tener mas de 50 caracteres",
                },
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: "El nombre solo puede tener letras y espacios",
                },
              })}
            />
            {errors?.name && (
              <span style={{ color: "a11919" }}>{errors?.name?.message}</span>
            )}
          </label>
          <label className="label-form-add">
            Precio
            <input
              type="number"
              placeholder="Precio del producto"
              {...register("price", {
                required: "El precio esta vacio",
                minLength: {
                  value: 1,
                  message: "El precio debe ser un número positivo",
                },
                maxLength: {
                  value: 10,
                  message: "El precio no puede tener mas de 10 caracteres",
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: "El precio solo puede ser un número",
                },
              })}
            />
            {errors?.price && (
              <span style={{ color: "a11919" }}>{errors?.price?.message}</span>
            )}
          </label>
          <label className="label-form-add">
            Imagen (opcional)
            <input
              type="text"
              placeholder="Ejemplo: spiderman.webp o img-products/spiderman.webp"
              {...register("image", {
                pattern: {
                  value: /^(img-products\/)?[\w-]+\.(jpg|jpeg|png|webp)$/i,
                  message: "Nombre de archivo inválido",
                },
              })}
            />
            {errors?.image && (
              <span style={{ color: "#a11919" }}>{errors?.image?.message}</span>
            )}
          </label>
          <label className="label-form-add">
            Descripción
            <textarea
              placeholder="Descripción del producto"
              {...register("description", {
                required: "La descripción está vacía",
                minLength: {
                  value: 20,
                  message: "La descripción debe tener más de 20 caracteres",
                },
                maxLength: {
                  value: 200,
                  message:
                    "La descripción no puede tener más de 200 caracteres",
                },
                pattern: {
                  value: /^[A-Za-z0-9\s.,!?áéíóúÁÉÍÓÚñÑ-]+$/u,
                  message:
                    "La descripción solo puede contener letras, números y algunos signos de puntuación",
                },
              })}
            />
            {errors?.description && (
              <span style={{ color: "#a11919" }}>
                {errors?.description?.message}
              </span>
            )}
          </label>
          <label className="label-form-add">
            Categoría
            <select
              {...register("category", {
                required: "La categoría es requerida",
              })}
            >
              <option value="">Seleccione una categoría</option>
              {category.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors?.category && (
              <span style={{ color: "#a11919" }}>
                {errors?.category?.message}
              </span>
            )}
          </label>
          <label className="label-form-add">
            Stock
            <input
              type="number"
              placeholder="Stock del producto"
              {...register("stock", {
                required: "El stock está vacío",
                min: {
                  value: 0,
                  message: "El stock debe ser un número positivo",
                },
              })}
            />
            {errors?.stock && (
              <span style={{ color: "#a11919" }}>{errors?.stock?.message}</span>
            )}
          </label>
          <label className="label-add-form">
            Costo
            <input
              type="text"
              placeholder="Costo del producto"
              {...register("cost", {
                required: "El costo está vacío",
                minLength: {
                  value: 1,
                  message: "El costo debe ser un número positivo",
                },
                maxLength: {
                  value: 10,
                  message: "El costo no puede tener más de 10 caracteres",
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: "El costo solo puede ser un número",
                },
              })}
            />
            {errors?.cost && (
              <span style={{ color: "#a11919" }}>{errors?.cost?.message}</span>
            )}
          </label>
          <label className="label-add-form">
            Supplier
            <input
              type="text"
              placeholder="Proveedor del producto"
              {...register("supplier", {
                required: "El proveedor es requerido",
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: "El proveedor solo puede contener letras y espacios",
                },
                minLength: {
                  value: 4,
                  message: "El proveedor debe tener más de 4 letras",
                },
              })}
            />
            {errors?.supplier && (
              <span style={{ color: "#a11919" }}>
                {errors?.supplier?.message}
              </span>
            )}
          </label>
          {errors.root && (
            <span style={{ color: "#a11919" }}>{errors.root.message}</span>
          )}

          <button
            className="btn-add-product"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Procesando..." : submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
};
export default ProductForm;
