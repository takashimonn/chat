import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [captchaValido, setCaptchaValido] = useState(false);
  const [errorCaptcha, setErrorCaptcha] = useState(false);
  const navigate = useNavigate();
  const captcha = useRef(null);

  const onChange = () => {
    if (captcha.current.getValue()) {
      setCaptchaValido(true);
      setErrorCaptcha(false); // Ocultar mensaje de error si el usuario verifica el captcha
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!captchaValido) {
      setErrorCaptcha(true);
      return; // Evita el envío del formulario
    }
    if (usuario && contrasena) {
      localStorage.setItem("token", "fake-token");
      navigate("/chat");
    }
  };

  return (
    <div className="login-page">
      <div className="image-container">
        <img src={require("../assets/control_escolar.png")} alt="Login Background" className="login-image" />
      </div>

      <div className="form-container">
        <div className="logo-container">
          <img
            src={require("../assets/logo.png")}
            alt="Logo"
            className="logo-image"
          />
        </div>

        <div className="login-container">
          <h2>Iniciar sesión</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Usuario:</label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Contraseña:</label>
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </div>
            <div className="recaptcha">
              <ReCAPTCHA
                ref={captcha}
                sitekey="6Lcxz-oqAAAAAPE6YrVlAKSP7ueo2fjKGYgxSFDw"
                onChange={onChange}
              />
            </div>
            {errorCaptcha && <p style={{ color: "red" }}>Por favor, verifica el reCAPTCHA</p>}
            <button type="submit">Iniciar sesión</button>
          </form>
          <p>
            ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;