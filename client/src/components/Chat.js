import React, { useState, useEffect } from 'react';
import { sendMessage, listenForMessages, disconnectSocket } from '../services/socket';
import '../styles/Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [materia, setMateria] = useState('');
  const [error, setError] = useState('');

  // Fetch messages for the selected subject
  const fetchMessages = async (materia) => {
    try {
      const response = await fetch(`http://localhost:3000/messages/${materia}`);
      const data = await response.json();
      setMessages(data); // Set the fetched messages
    } catch (error) {
      console.error('Error al cargar los mensajes:', error);
      setError('No se pudieron cargar los mensajes.');
    }
  };

  useEffect(() => {
    if (materia) {
      const messageListener = (msg) => {
        setMessages((prevMessages) => {
          if (!prevMessages.find(message => message._id === msg._id)) {
            return [...prevMessages, msg];
          }
          return prevMessages;
        });
      };

      listenForMessages(materia, messageListener);
      fetchMessages(materia); // Fetch the messages when the materia changes

      // Cleanup when switching subjects
      return () => {
        disconnectSocket();
      };
    }
  }, [materia]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input && materia) {
      setError('');
      const message = { text: input, materia };
      sendMessage(message);
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
