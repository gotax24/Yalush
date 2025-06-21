import { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  "https://pydolarve.org/api/v2/dollar?page=bcv&monitor=mercantil_banco&format_date=default&rounded_price=true";

export const useDailyDollarRate = () => {
  const [ves, setVes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getToday9AM = () => {
    const now = new Date();
    const nineAM = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      9,
      0,
      0
    );
    return nineAM;
  };

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const storedData = JSON.parse(localStorage.getItem("dollarRate"));

        const now = new Date();
        const today9AM = getToday9AM();

        if (
          storedData &&
          storedData.date &&
          new Date(storedData.date) > today9AM
        ) {
          setVes(storedData.ves);
          setLoading(false);
          return;
        }

        const response = await axios.get(API_URL);
        const rate = response.data.price;

        localStorage.setItem(
          "dollarRate",
          JSON.stringify({ ves: rate, date: now.toISOString() })
        );

        setVes(rate);
      } catch (err) {
        console.error(err);
        setError("Error al obtener la tasa");
      } finally {
        setLoading(false);
      }
    };

    fetchRate();
  }, []);

  return { ves, loading, error };
};
