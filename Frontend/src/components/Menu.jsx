import { Link, NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { SignInButton, SignUpButton, useClerk } from "@clerk/clerk-react";
import { UserContext } from "../context/UserContext";
import Modal from "./Modal";
import bag from "../assets/bag.svg";
import fav from "../assets/fav.svg";
import logoutIcon from "../assets/logout.svg";
import search from "../assets/search.svg";
import userSvg from "../assets/user.svg";
import sadPerson from "../assets/sadPerson.svg";
import "../css/Menu.css";

const Menu = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, userInfo } = useContext(UserContext);
  const { signOut } = useClerk();

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  return (
    <>
      <header className="header-main">
        <div className="container-menu">
          <nav className="nav-menu-text">
            <ul className="ul-menu-tex">
              <li className="li-menu-text">
                <NavLink to="/">Inicio</NavLink>
              </li>
              <li className="li-menu-text">
                <NavLink to="/products">Productos</NavLink>
              </li>
              <li className="li-menu-text">
                <NavLink to="/contactos">Contacto</NavLink>
              </li>
            </ul>
          </nav>
        </div>
        <div className="container-title">
          <h1 className="title-menu">Yalush</h1>
        </div>
        <div className="container-icons">
          <nav className="nav-menu-icons">
            <li
              className="li-menu-icons user-icon"
              onClick={toggleDropdown}
              onDoubleClick={closeDropdown}
            >
              {isAuthenticated ? (
                <Link to="/profile">
                  <img
                    className="imgae-perfil-menu"
                    src={userInfo.imageUrl}
                    alt="icono de usuario"
                  />{" "}
                </Link>
              ) : (
                <div className="dropdown-container">
                  <img src={userSvg} alt="icono de usuario" />
                  {showDropdown && (
                    <div className="dropdown-menu">
                      <SignUpButton mode="modal" redirectUrl="/">
                        <button className="dropdown-button">Registrarse</button>
                      </SignUpButton>
                      <SignInButton mode="modal" redirectUrl="/">
                        <button className="dropdown-button">
                          Iniciar sesión
                        </button>
                      </SignInButton>
                    </div>
                  )}
                </div>
              )}
            </li>
            <li className="li-menu-icons">
              <img src={search} alt="icono de buscar" />
            </li>
            <li className="li-menu-icons">
              <img src={fav} alt="icono de favorito" className="heart"/>
            </li>
            <li className="li-menu-icons">
              <img src={bag} alt="icono de bolsa" />
            </li>
            <li className="li-menu-icons">
              {" "}
              <img
                onClick={openModal}
                src={logoutIcon}
                alt="icono de cerrar sesion"
              />
            </li>
          </nav>
        </div>
      </header>
      {isAuthenticated && (
        <Modal isOpen={isOpen} closeModal={closeModal}>
          <h2>¿Estás seguro de que quieres cerrar sesión?</h2>
          <img src={sadPerson} alt="Persona triste" className="img-logout" />
          <button
            className="button-logout confirm"
            onClick={() => signOut({ redirectUrl: "/" })}
          >
            Cerrar sesión
          </button>
          <button className="button-logout" onClick={closeModal}>
            Cancelar
          </button>
        </Modal>
      )}
    </>
  );
};

export default Menu;
