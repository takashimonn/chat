import React, { useState, useEffect } from 'react';
import { sendMessage, listenForMessages, disconnectSocket } from '../services/socket';
import '../styles/Chat.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag, faExclamationTriangle, faFilter } from '@fortawesome/free-solid-svg-icons';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [materia, setMateria] = useState('');
  const [priority, setPriority] = useState('normal');
  const [error, setError] = useState('');
  const [showUrgentModal, setShowUrgentModal] = useState(false);

  const fetchMessages = async (materia) => {
    try {
      const response = await fetch(`http://localhost:3000/messages/${materia}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error al cargar los mensajes:', error);
      setError('No se pudieron cargar los mensajes.');
    }
  };

  useEffect(() => {
    if (materia) {
      const messageListener = (msg) => {
        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.map((message) =>
            message._id === msg._id ? msg : message
          );
          if (!updatedMessages.find((message) => message._id === msg._id)) {
            updatedMessages.push(msg);
          }
          return updatedMessages;
        });
      };

      listenForMessages(materia, messageListener);
      fetchMessages(materia);

      return () => {
        disconnectSocket();
      };
    }
  }, [materia]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input && materia) {
      setError('');

      const message = { text: input, materia, priority };
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
        <div className="chat-header">
          {materia && <h1>Materia: {materia}</h1>}
          <button className="urgent-filter-button" onClick={() => setShowUrgentModal(true)}>
            <FontAwesomeIcon icon={faFilter} />
          </button>
        </div>
        {error && <p className="error">{error}</p>}

        <div className="messages">
          <ul>
            {messages.map((msg, index) => (
              <li key={index} className="message-item">
                <strong>{msg.materia}:</strong> {msg.text}
                <div className="priority-container">
                  {msg.priority === 'normal' ? (
                    <FontAwesomeIcon icon={faFlag} className="priority priority-normal" />
                  ) : (
                    <FontAwesomeIcon icon={faExclamationTriangle} className="priority priority-urgente" />
                  )}
                </div>
                <span className={`status ${msg.status}`}>{msg.status}</span>
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
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="normal">Normal</option>
            <option value="urgente">Urgente</option>
          </select>
          <button type="submit">Enviar</button>
        </form>

        {showUrgentModal && (
          <div className="urgent-modal">
            <div className="urgent-modal-content">
              <button className="close-modal" onClick={() => setShowUrgentModal(false)}>
                Cerrar
              </button>
              <h2>Mensajes Urgentes</h2>
              <ul>
                {messages
                  .filter((msg) => msg.priority === 'urgente')
                  .map((msg, index) => (
                    <li key={index} className="message-item">
                      <strong>{msg.materia}:</strong> {msg.text}
                      <div className="priority-container">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="priority priority-urgente" />
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;