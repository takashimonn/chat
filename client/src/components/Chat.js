import React, { useState, useEffect } from 'react';
import { sendMessage, listenForMessages, disconnectSocket } from '../services/socket';
import '../styles/Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [materia, setMateria] = useState('');
  const [error, setError] = useState('');

  // Escuchar mensajes
  useEffect(() => {
    const messageListener = (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    };

    listenForMessages(messageListener);

    return () => {
      disconnectSocket();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input && materia) {
      setError('');
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
        </ul>
      </div>

      {/* Contenedor de chat */}
      <div className="chat-box">
        <h1>Chat - {materia}</h1>

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
          <div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje"
            />
          </div>
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
