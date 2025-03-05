import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

// Función para enviar mensajes a una materia específica
export const sendMessage = (message) => {
  console.log('Sending message:', message); // Log para asegurarnos de que el mensaje se está enviando
  socket.emit('chat message', message);
};

// Función para escuchar los mensajes de una materia específica
export const listenForMessages = (materia, callback) => {
  socket.emit('join room', materia);  // Unirse a la sala de la materia
  socket.on(materia, (msg) => {
    callback(msg);  // Ejecutar la función callback con el mensaje recibido
  });
};

// Desconectar socket cuando ya no sea necesario
export const disconnectSocket = () => {
  socket.off('chat message');
  socket.disconnect();
};

export default socket;
