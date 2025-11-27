import emailjs from "@emailjs/browser";

export const SendEmailContact = (user) => {
  if (!user || !user.name || !user.email || !user.message) {
    const errorMessage = "Faltan datos requeridos (nombre, email o mensaje) para enviar el correo.";
    console.error(errorMessage);
    // Al lanzar un error, el bloque 'catch' de async/await lo capturará
    throw new Error(errorMessage);
  }

  const templateParams = {
    name: user.name,
    email: user.email,
    message: user.message,
  };

  // emailjs.send() devuelve una promesa, por lo que 'await' funciona perfectamente
  return emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID_2,
    templateParams,
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  );
};