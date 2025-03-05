import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Cambia la URL si es necesario

// Función para enviar mensajes
export const sendMessage = ({ text, materia }) => {
  // Enviar mensaje con texto y materia
  socket.emit('chat message', { text, materia, user: 'me' });
};

// Función para escuchar los mensajes
export const listenForMessages = (callback) => {
  socket.on('chat message', (msg) => {
    callback(msg);  // Ejecutar la función callback con el mensaje recibido
  });
};

// Desconectar socket cuando ya no sea necesario
export const disconnectSocket = () => {
  socket.off('chat message');
};

export default socket;
