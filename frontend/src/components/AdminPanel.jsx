import { useState } from "react";
import Modal from "./Modal";
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm";
import DeleteProductForm from "./DeleteProductForm";

const AdminPanel = () => {
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const openModalAdd = () => setIsOpenAdd(true);
  const closeModalAdd = () => setIsOpenAdd(false);

  const openModalEdit = () => setIsOpenEdit(true);
  const closeModalEdit = () => setIsOpenEdit(false);

  const openModalDelete = () => setIsOpenDelete(true);
  const closeModalDelete = () => setIsOpenDelete(false);

  return (
    <>
      <h1>Panel de administrador</h1>
      <p>
        Bienvenido al panel de administración. Aquí puedes gestionar usuarios,
        ver estadísticas y más.
      </p>

      <section>
        <h2>Gestion de Productos</h2>
        <button onClick={openModalAdd}>Agregar Producto</button>
        <button onClick={openModalEdit}>Editar Producto</button>
        <button onClick={openModalDelete}>Eliminar Producto</button>
      </section>

      {isOpenAdd && (
        <Modal isOpen={isOpenAdd} closeModal={closeModalAdd}>
          <AddProductForm closeModal={closeModalAdd} />
        </Modal>
      )}
      {isOpenEdit && (
        <Modal isOpen={isOpenEdit} closeModal={closeModalEdit}>
          <EditProductForm closeModal={closeModalEdit} />
        </Modal>
      )}
      {isOpenDelete && (
        <Modal isOpen={isOpenDelete} closeModal={closeModalDelete}>
          <DeleteProductForm closeModal={closeModalDelete} />
        </Modal>
      )}
    </>
  );
};

export default AdminPanel;
