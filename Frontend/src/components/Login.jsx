import { SignIn } from "@clerk/clerk-react";
import { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const SignUpPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button onClick={openModal}>Registrarse</button>
      <Modal
        isOpen={isOpen}
        onrequestClose={closeModal}
        contentLabel="Iniciar sesion"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <button onClick={closeModal} style={{ float: "right" }}>
          {" "}
          X{" "}
        </button>
        <SignIn />
      </Modal>
    </>
  );
};

export default SignUpPage;
