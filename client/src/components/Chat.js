// src/components/Chat.js
import React, { useState, useEffect } from 'react';
import { sendMessage, listenForMessages, disconnectSocket } from '../services/socket';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // Escuchar mensajes al cargar el componente
  useEffect(() => {
    // Suscribirse una sola vez
    const messageListener = (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    };

    listenForMessages(messageListener);

    // Cleanup: cuando se desmonta el componente, dejar de escuchar
    return () => {
      disconnectSocket();  // Desuscribirse de los eventos del socket
    };
  }, []);  // Dependencias vacías para escuchar solo una vez

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input) {
      sendMessage(input); // Emitir mensaje al backend
      setInput('');
    }
  };

  return (
    <div>
      <h1>Chat</h1>
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

export default Chat;
