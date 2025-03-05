import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación simple de contraseñas
    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      // Realizando la solicitud POST al backend
      const response = await axios.post('http://localhost:3000/auth/register', {
        usuario,
        contrasena,
      });

      if (response.status === 201) {
        // Si la respuesta es correcta, redirige a la página de login
        navigate('/login');
      } else {
        setError(response.data.message || 'Error al registrar usuario');
      }
    } catch (err) {
      console.error('Error al registrar usuario:', err);
      setError('Hubo un error al conectar con el servidor');
    }
  };

  return (
    <div>
      <h1>Registro de Usuario</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="usuario">Usuario</label>
          <input
            type="text"
            id="usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="contrasena">Contraseña</label>
          <input
            type="password"
            id="contrasena"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmarContrasena">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmarContrasena"
            value={confirmarContrasena}
            onChange={(e) => setConfirmarContrasena(e.target.value)}
            required
          />
        </div>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default Register;
