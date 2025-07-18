

const AdminPanel = () => {

  const SERVER = import.meta.env.VITE_SERVER_URL;


  const handleAddProduct = async () => {
    
  };

  const handleEditProduct = async () => {
    // Lógica para editar un producto
  };

  const handleDeleteProduct = async () => {
    // Lógica para eliminar un producto
  };

  return (
    <>
      <h1>Panel de administrador</h1>
      <p>
        Bienvenido al panel de administración. Aquí puedes gestionar usuarios,
        ver estadísticas y más.
      </p>

      <section>
        <h2>Gestion de Productos</h2>
        <button onClick={handleAddProduct}>Agregar Producto</button>
        <button onClick={handleEditProduct}>Editar Producto</button>
        <button onClick={handleDeleteProduct}>Eliminar Producto</button>
      </section>
    </>
  );
};

export default AdminPanel;
