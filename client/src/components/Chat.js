import React, { useState, useEffect } from 'react';
import { sendMessage, listenForMessages, disconnectSocket } from '../services/socket';
import '../styles/Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [materia, setMateria] = useState('');  // Estado para la materia seleccionada
  const [error, setError] = useState('');  // Estado para manejar los errores

  // Escuchar mensajes al cargar el componente
  useEffect(() => {
    // Suscribirse a los mensajes entrantes
    const messageListener = (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    };

    listenForMessages(messageListener);

    // Cleanup: cuando se desmonta el componente, dejar de escuchar
    return () => {
      disconnectSocket();  // Desuscribirse de los eventos del socket
    };
  }, []);  // Dependencias vacías para escuchar solo una vez

  // Función para manejar el envío de mensajes
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input && materia) {
      // Enviar el mensaje con la materia seleccionada
      setError('');  // Limpiar cualquier error anterior
      sendMessage({ text: input, materia });
      setInput('');  // Limpiar el input
    } else {
      setError('Por favor, ingresa un mensaje y selecciona una materia.');  // Mostrar error si faltan campos
    }
  };

  return (
    <div>
      <h1>Chat</h1>

      {/* Mostrar error si falta información */}
      {error && <p className="error">{error}</p>}

      {/* Formulario para seleccionar materia y escribir mensaje */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="materia">Selecciona una materia:</label>
          <select
            id="materia"
            value={materia}
            onChange={(e) => setMateria(e.target.value)}
          >
            <option value="">Selecciona una materia</option>
            <option value="Matemáticas">Matemáticas</option>
            <option value="Física">Física</option>
            <option value="Química">Química</option>
          </select>
        </div>

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

      {/* Mostrar los mensajes recibidos */}
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            <strong>{msg.materia}</strong>: {msg.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Chat;
