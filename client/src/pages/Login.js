import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css"; // Asegúrate de que la ruta del archivo CSS sea correcta

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
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
            src={require("../assets/logo.png")} // Corregir la ruta de la imagen
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
