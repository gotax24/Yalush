import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "./Loading";
import Product from "./Product";
import "../css/Layout.css";

const Layout = () => {
  // URL del servidor (usamos variable de entorno)
  const SERVER = import.meta.env.VITE_SERVER_URL;

  // Estados principales
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1); // página actual
  const itemsPerPage = 9; // cantidad de productos por página

  // useEffect para cargar productos (cuando cambia la categoría)
  useEffect(() => {
    setLoading(true);

    // Si hay una categoría seleccionada, filtramos por categoría
    const url = category
      ? `${SERVER}/products?category=${category}`
      : `${SERVER}/products`;

    axios
      .get(url)
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setError(e);
        setLoading(false);
      });
  }, [SERVER, category]);

  // Siempre que cambien los filtros (categoría o búsqueda), reinicia a página 1
  useEffect(() => {
    setCurrentPage(1);
  }, [category, search]);

  // Filtrar productos según búsqueda
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  // Lógica de paginación: cortamos el array filtrado en "páginas"
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage); // cuántas páginas hay

  // Mostrar cargando si es necesario
  if (loading) return <Loading />;

  return (
    <>
      <div className="container-layout">
        {/* Input de búsqueda */}
        <div className="container-search">
          <input
            type="search"
            placeholder="Busca tu producto aqui"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="container-categories-horizontal">
          <label>
            <input
              type="radio"
              name="category"
              onChange={() => setCategory(false)}
              checked={category === ""}
            />
            Todos
          </label>
          {["pillows", "bags", "keychains", "swimwear", "dress", "other"].map(
            (categoryName) => (
              <label key={categoryName}>
                <input
                  type="radio"
                  name="category"
                  onChange={() => setCategory(categoryName)}
                  checked={category === categoryName}
                />
                {categoryName === "pillows" && "Almohadas"}
                {categoryName === "bags" && "Bolsos"}
                {categoryName === "keychains" && "Llaveros"}
                {categoryName === "swimwear" && "Traje de baños"}
                {categoryName === "dress" && "Vestidos"}
                {categoryName === "other" && "Más cosas"}
              </label>
            )
          )}
        </div>

        <section className="container-products">
          {currentProducts.map(({ id, name, image, price, category }) => (
            <Product
              key={id}
              id={id}
              name={name}
              image={image}
              price={price}
              category={category}
            />
          ))}

          {error && <p>{error.message || "Ocurrió un problema"}</p>}
        </section>
      </div>

      {/* Paginación */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setCurrentPage(pageNumber)}
              className={currentPage === pageNumber ? "active-page" : ""}
            >
              {pageNumber}
            </button>
          )
        )}
      </div>
    </>
  );
};

export default Layout;
