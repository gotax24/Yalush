import { NavLink } from "react-router-dom";
import { useState } from "react";
import { SignInButton, SignUpButton, useClerk } from "@clerk/clerk-react";
import bag from "../assets/bag.svg";
import fav from "../assets/fav.svg";
import logoutIcon from "../assets/logout.svg";
import search from "../assets/search.svg";
import user from "../assets/user.svg";
import "../css/Menu.css";

const Menu = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const { signOut } = useClerk();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  const logOut = () => {
    signOut({ redirectUrl: "/" });
  };

  return (
    <header className="header-main">
      <div className="container-menu">
        <nav className="nav-menu-text">
          <ul className="ul-menu-tex">
            <li className="li-menu-text">
              <NavLink to="/">Inicio</NavLink>
            </li>
            <li className="li-menu-text">
              <NavLink to="/compra">Compra</NavLink>
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
            className="li-menu-icons"
            onMouseEnter={toggleDropdown}
            onMouseLeave={closeDropdown}
          >
            <img src={user} alt="icono de usuario" />
            {showDropdown && (
              <div className="dropdown-menu">
                {/*Aqui se verifica si esta logeado o no si esta logeado se
                ingresa a otra pagina se redirige a la pagina de perfil si no
                muestra el login o el signup*/}
                <>
                  <SignUpButton mode="modal" redirectUrl="/">
                    <button className="dropdown-button">Registrarse</button>
                  </SignUpButton>
                  <SignInButton mode="modal" redirectUrl="/">
                    <button className="dropdown-button">Iniciar sesion</button>
                  </SignInButton>
                </>
              </div>
            )}
          </li>
          <li className="li-menu-icons">
            <img src={search} alt="icono de buscar" />
          </li>
          <li className="li-menu-icons">
            <img src={fav} alt="icono de favorito" />
          </li>
          <li className="li-menu-icons">
            <img src={bag} alt="icono de bolsa" />
          </li>
          <li className="li-menu-icons">
            {" "}
            <img
              onClick={logOut}
              src={logoutIcon}
              alt="icono de cerrar sesion"
            />
          </li>
        </nav>
      </div>
    </header>
  );
};

export default Menu;
