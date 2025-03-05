import React, { useState, useEffect } from 'react'; 
import { sendMessage, listenForMessages, disconnectSocket } from '../services/socket';
import '../styles/Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [materia, setMateria] = useState('');
  const [error, setError] = useState('');

  // Escuchar mensajes de la materia seleccionada
  useEffect(() => {
    if (materia) {
      const messageListener = (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      };

      // Empezar a escuchar los mensajes de la materia seleccionada
      listenForMessages(materia, messageListener);

      // Cleanup: cuando se desmonta el componente, dejar de escuchar
      return () => {
        disconnectSocket();
      };
    }
  }, [materia]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input && materia) {
      setError('');  // Limpiar error si los campos son válidos
      // Enviar el mensaje con la materia seleccionada
      sendMessage({ text: input, materia });
      setInput('');
    } else {
      setError('Por favor, ingresa un mensaje y selecciona una materia.');
    }
  };

  return (
    <div className="chat-container">
      {/* Menú lateral */}
      <div className="menu-lateral">
        <h2>Materias</h2>
        <ul>
          <li onClick={() => setMateria('Matemáticas')}>Matemáticas</li>
          <li onClick={() => setMateria('Física')}>Física</li>
          <li onClick={() => setMateria('Química')}>Química</li>
          <li onClick={() => setMateria('Álgebra')}>Álgebra</li>
          <li onClick={() => setMateria('Historia')}>Historía</li>
          <li onClick={() => setMateria('Lectura')}>Lectura</li>
          <li onClick={() => setMateria('Informatica')}>Informática</li>
        </ul>
      </div>

      {/* Contenedor de chat */}
      <div className="chat-box">
        {materia && <h1>Materia: {materia}</h1>}

        {error && <p className="error">{error}</p>}

        <div className="messages">
          <ul>
            {messages.map((msg, index) => (
              <li key={index}>
                <strong>{msg.materia}</strong>: {msg.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Formulario para enviar mensaje */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje"
          />
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
