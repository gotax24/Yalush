import '../css/Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-social">
      {/* Redes de la empresa */}
      <a href="https://instagram.com/yalush" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <i className="fab fa-instagram"></i>
      </a>
      <a href="https://facebook.com/yalush" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
        <i className="fab fa-facebook"></i>
      </a>
      <a href="https://wa.me/584123456789" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <i className="fab fa-whatsapp"></i>
      </a>
      <a href="mailto:contacto@yalush.com" aria-label="Email">
        <i className="fas fa-envelope"></i>
      </a>
      {/* Separador visual */}
      <span className="footer-separator">|</span>
      {/* Tus redes personales */}
      <a href="https://github.com/gotax24/" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        <i className="fab fa-github"></i>
      </a>
      <a href="https://linkedin.com/in/yaldriani" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
        <i className="fab fa-linkedin"></i>
      </a>
    </div>
    <div className="footer-copy">
      <span>© {new Date().getFullYear()} Yalush</span>
      <span className="footer-creator">
        | Hecho con <span style={{color: "#e25555"}}>♥</span> por <a href="https://github.com/tuusuario" target="_blank" rel="noopener noreferrer">Ernesto</a>
      </span>
    </div>
  </footer>
);

export default Footer;