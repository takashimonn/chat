// src/App.js

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');  // Asegúrate de que la URL del servidor esté correcta

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // Escuchar nuevos mensajes desde el servidor
  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Limpiar el socket al desmontar el componente
    return () => {
      socket.off('chat message');
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input) {
      socket.emit('chat message', input);  // Enviar el mensaje al servidor
      setInput('');
    }
  };

  return (
    <div>
      <h1>Chat App</h1>

      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default App;
