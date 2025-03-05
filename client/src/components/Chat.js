import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import '../styles/Chat.css';

const socket = io('http://localhost:3000'); // Conexión con el servidor

const Chat = () => {
  const [messages, setMessages] = useState([]);  // Para almacenar los mensajes actuales
  const [input, setInput] = useState('');
  const [materia, setMateria] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (materia) {
      // Limpiar los mensajes cuando se cambia de materia
      setMessages([]);

      // Escuchar los mensajes de la materia seleccionada
      const messageListener = (msg) => {
        setMessages((prevMessages) => {
          // Asegurarse de que no se agreguen mensajes duplicados
          if (!prevMessages.find((message) => message._id === msg._id)) {
            return [...prevMessages, msg];
          }
          return prevMessages;
        });
      };

      socket.emit('join room', materia);  // Unirse a la sala de la materia seleccionada
      socket.on('chat message', messageListener);

      // Limpiar el listener cuando se cambie de materia
      return () => {
        socket.off('chat message', messageListener);
      };
    }
  }, [materia]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input && materia) {
      setError('');
      const message = { text: input, materia };
      socket.emit('chat message', message); // Emitir mensaje al servidor
      setInput('');
    } else {
      setError('Por favor, ingresa un mensaje y selecciona una materia.');
    }
  };

  return (
    <div className="chat-container">
      <div className="menu-lateral">
        <h2>Materias</h2>
        <ul>
          <li onClick={() => setMateria('Matemáticas')}>Matemáticas</li>
          <li onClick={() => setMateria('Física')}>Física</li>
          <li onClick={() => setMateria('Química')}>Química</li>
          <li onClick={() => setMateria('Álgebra')}>Álgebra</li>
          <li onClick={() => setMateria('Historia')}>Historia</li>
          <li onClick={() => setMateria('Lectura')}>Lectura</li>
          <li onClick={() => setMateria('Informática')}>Informática</li>
        </ul>
      </div>

      <div className="chat-box">
        {materia && <h1>Materia: {materia}</h1>}

        {error && <p className="error">{error}</p>}

        <div className="messages">
          <ul>
            {messages.map((msg, index) => (
              <li key={index} className="message-item">
                <strong>{msg.materia}:</strong> {msg.text}
              </li>
            ))}
          </ul>
        </div>

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
