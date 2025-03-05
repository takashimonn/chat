// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Aquí agregarías la lógica para hacer login (verificar las credenciales)
    // Por ejemplo, una llamada al backend usando fetch o axios

    // Simulamos un login exitoso y guardamos un token en localStorage
    localStorage.setItem("token", "fake-token");

    navigate("/chat");
  };

  return (
    <div>
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
  );
};

export default Login;
