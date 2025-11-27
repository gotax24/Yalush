import { Link } from "react-router-dom";
import lost from "../assets/lost.svg";
import "../css/Page404.css";

const Page404 = () => {
  return (
    <>
      <div className="container">
        <div className="container-title">
          <h1 className="title-404">Que paso?</h1>
          <h2 className="sub-title-404">Te perdiste?</h2>
          <img src={lost} alt="imagen de perdido" className="img-404" />
        </div>
        <div className="container-footer">
          <Link to="/">
            No te preocupes puedes presionar aqui para regresar a la pagina
            principal
          </Link>
        </div>
      </div>
    </>
  );
};

export default Page404;
