import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaEnvelope, FaYoutube } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="AppFooter">
      <div className="FooterContent">
        <img
          src="/LOGO.PNG"
          onClick={() => navigate("/")}
          className="LogoSideBar"
          alt="logo"
        />

        <div className="FooterIcons">
          <button onClick={() => window.open("https://www.facebook.com/CintasSueltas", "_blank")} aria-label="Facebook">
            <FaFacebookF />
          </button>
          <button onClick={() => window.open("https://www.instagram.com/cintas_sueltas", "_blank")} aria-label="Instagram">
            <FaInstagram />
          </button>
          <button onClick={() => window.open("https://www.youtube.com/@enzobeatleyfloyd", "_blank")} aria-label="YouTube">
            <FaYoutube />
          </button>
          <button onClick={() => window.location.href = "mailto:registrocintassueltas@gmail.com"} aria-label="Email">
            <FaEnvelope />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
