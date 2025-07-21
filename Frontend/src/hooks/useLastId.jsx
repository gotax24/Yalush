import axios from "axios";
import { useEffect, useState } from "react";

const useLastId = () => {
  const [lastId, setLastId] = useState(0);

  const SERVER = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    axios.get(`${SERVER}/products`)
      .then((res) => {
        const ids = res.data.map((p) => Number(p.id)).filter(Boolean);
        setLastId(ids.length ? Math.max(...ids) : 0);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLastId(0); // En caso de error, reiniciar lastId
      });
  }, [SERVER]);

  return { lastId };
};

export default useLastId;
