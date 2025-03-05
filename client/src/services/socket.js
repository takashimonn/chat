// src/services/socket.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Cambia la URL si es necesario

// Función para enviar mensajes
export const sendMessage = (message) => {
  socket.emit('chat message', message);
};

// Función para escuchar los mensajes
export const listenForMessages = (callback) => {
  socket.on('chat message', callback);
};

// Desconectar socket cuando ya no sea necesario
export const disconnectSocket = () => {
  socket.off('chat message');
};

export default socket;
