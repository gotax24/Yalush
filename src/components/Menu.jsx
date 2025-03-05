import { NavLink } from "react-router-dom";

const Menu = () => {
  const logOut = () => {
    console.log("Cerrar sesion gg");
  };

  return (
    <header className="header-main">
      <div className="container-logo">
        <img className="logo-menu" src="" alt="logo de la pagina" />
        <h1 className="title-menu">Nombre que escoja</h1>
      </div>
      <div className="container-menu">
        <nav className="nav-menu">
          <ul className="ul-menu">
            <li className="li-menu">
              <NavLink to="/">Inicio</NavLink>
            </li>
            <li className="li-menu">
              <NavLink to="/productos">Productos</NavLink>
            </li>
            <li className="li-menu">
              <NavLink to="/usuario">Usuario</NavLink>
            </li>
            <li className="li-menu">
              <NavLink to="/contactos">Sobre Nosotros</NavLink>
            </li>
            <li>
              <button onClick={logOut}>Cerrar sesión</button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Menu;
