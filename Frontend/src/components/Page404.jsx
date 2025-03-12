import { Link } from "react-router-dom";

const Page404 = () => {
  return (
    <>
      <div className="container">
        <div className="container-title">
          <h1 className="title-404">Que paso?</h1>
          <h2 className="sub-title">Te perdiste?</h2>
          <img src="" alt="imagen de perdido" />
        </div>
        <div className="container-footer">
          <Link to="/">
            No te preocupes puedes presionar aqui para regresar 👍
          </Link>
        </div>
      </div>
    </>
  );
};

export default Page404;
