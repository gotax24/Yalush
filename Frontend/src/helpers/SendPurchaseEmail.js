import emailjs from "@emailjs/browser";
import { generateOrderId } from "./GenerateOrderId";

export const sendPurchaseEmail = (user, total) => {
  if (!user || !user.cart || user.cart.length === 0) {
    throw new Error("El usuario no tiene un carrito válido o está vacío.");
  }

  if (typeof total !== "number" || isNaN(total) || total <= 0) {
    throw new Error("El total debe ser un número válido y mayor que cero.");
  }

  // ✅ Adaptar cada item al formato que EmailJS espera
  const formattedCart = user.cart.map((item) => ({
    name: item.title,            // EmailJS: {{name}}
    price: item.price.toFixed(2), // EmailJS: {{price}}
    units: item.quantity,        // EmailJS: {{units}}
    image_url: item.image || "", // EmailJS: {{image_url}}
  }));

  const templateParams = {
    name: user.name,
    email: user.email,
    order_id: generateOrderId(),
    orders: formattedCart, // 👈 Aquí va el array transformado
    cost: {
      shipping: 0,
      total: total.toFixed(2),
    },
  };

  return emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    templateParams,
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  );
};
