import emailjs from "@emailjs/browser";
import { generateOrderId } from "./GenerateOrderId";

export const sendPurchaseEmail = (user, total) => {
  // Verifica que el usuario tenga un carrito y que no esté vacío
  if (!user || !user.cart || user.cart.length === 0) {
    throw new Error("El usuario no tiene un carrito válido o está vacío.");
  }
  // Verifica que el total sea un número válido
  if (typeof total !== "number" || isNaN(total) || total <= 0) {
    throw new Error("El total debe ser un número válido y mayor que cero.");
  }

  const templateParams = {
    name: user.name, // Para {{name}} en el saludo
    email: user.email, // Para el footer
    order_id: generateOrderId(), // Para {{order_id}}
    orders: user.cart, // Array para el bucle {{#orders}}
    cost: {
      shipping: 0, // Para {{cost.shipping}}
      total: total, // Para {{cost.total}}
    },
  };

  // Envía el correo electrónico usando EmailJS
  return emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    templateParams,
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  );
};
