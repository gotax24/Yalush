import "../css/Contact.css";

const Contact = () => {
  return (
    <div className="contact-container">
      <div className="contact-card">
        <h1 className="contact-title">Contáctanos</h1>
        <p className="contact-subtitle">
          ¿Tienes dudas, sugerencias o necesitas ayuda? ¡Escríbenos!
        </p>
        <form className="contact-form">
          <label>
            Nombre
            <input type="text" placeholder="Tu nombre" required />
          </label>
          <label>
            Correo electrónico
            <input type="email" placeholder="tu@email.com" required />
          </label>
          <label>
            Mensaje
            <textarea placeholder="¿En qué podemos ayudarte?" required />
          </label>
          <button type="submit" className="contact-btn">Enviar mensaje</button>
        </form>
        <div className="contact-info">
          <p><strong>Email:</strong> contacto@yalush.com</p>
          <p><strong>Teléfono:</strong> +58 123-4567890</p>
          <p><strong>Dirección:</strong> Maracaibo, Venezuela</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;