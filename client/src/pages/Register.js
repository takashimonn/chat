import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReCAPTCHA from "react-google-recaptcha";

const Register = () => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState('');
  const [captchaValido, setCaptchaValido] = useState(false);
  const [errorCaptcha, setErrorCaptcha] = useState(false);
  const navigate = useNavigate();
  const captcha = useRef(null);

  const onChange = () => {
    if (captcha.current.getValue()) {
      setCaptchaValido(true);
      setErrorCaptcha(false); // Ocultar el mensaje de error si el usuario verifica el captcha
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaValido) {
      setErrorCaptcha(true);
      return; // Evita el envío del formulario
    }

    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/register', {
        usuario,
        contrasena,
      });

      if (response.status === 201) {
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
    <div style={styles.outerContainer}>
      <div style={styles.registerContainer}>
        <h1 style={styles.title}>Registro de Usuario</h1>
        {error && <p style={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="usuario" style={styles.label}>Usuario</label>
            <input
              type="text"
              id="usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="contrasena" style={styles.label}>Contraseña</label>
            <input
              type="password"
              id="contrasena"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="confirmarContrasena" style={styles.label}>Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmarContrasena"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={{ marginBottom: "15px", textAlign: "center" }}>
            <ReCAPTCHA
              ref={captcha}
              sitekey="6Lcxz-oqAAAAAPE6YrVlAKSP7ueo2fjKGYgxSFDw"
              onChange={onChange}
            />
          </div>
          {errorCaptcha && <p style={{ color: "red", textAlign: "center" }}>Por favor, verifica el reCAPTCHA</p>}
          <button type="submit" style={styles.registerButton}>Registrar</button>
        </form>
      </div>
    </div>
  );
};

// Estilos de la página de registro
const styles = {
  outerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#ffffff',
  },
  registerContainer: {
    width: '100%',
    maxWidth: '400px',
    padding: '38px',
    background: '#ffffff',
    borderRadius: '15px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
    margin: 'auto',
    border: '2rem solid #FFA409',
  },
  title: {
    color: '#333',
    marginBottom: '30px',
    fontSize: '28px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '25px',
    textAlign: 'left',
  },
  label: {
    display: 'block',
    fontWeight: '500',
    marginBottom: '10px',
    fontSize: '16px',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '14px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    marginBottom: '15px',
    background: '#f9f9f9',
  },
  registerButton: {
    width: '100%',
    padding: '16px',
    background: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: '600',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    boxShadow: '0 4px 6px rgba(0, 123, 255, 0.2)',
  },
  errorMessage: {
    color: '#ff4444',
    fontWeight: '600',
    marginBottom: '20px',
    fontSize: '16px',
    textAlign: 'center',
    padding: '10px',
    background: 'rgba(255, 68, 68, 0.1)',
    borderRadius: '8px',
    border: '1px solid #ff4444',
  },
};

export default Register;

