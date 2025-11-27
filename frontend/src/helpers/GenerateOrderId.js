export const generateOrderId = () => {
  // Obtiene la fecha actual
  const date = new Date();
  // Formatea la fecha como YYYYMMDD
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, "");
  // Genera un número aleatorio de 6 dígitos
  // El número aleatorio se genera entre 100000 y 999999
  const rand = Math.floor(100000 + Math.random() * 900000);
  // Combina ambos para crear el ID de orden
  return `ORD-${ymd}-${rand}`;
};
