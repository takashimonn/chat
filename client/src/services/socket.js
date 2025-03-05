import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

// Función para enviar mensajes a una materia específica
export const sendMessage = (message) => {
  // Enviar el mensaje al canal de la materia correspondiente
  socket.emit('chat message', message);
};

// Función para escuchar los mensajes de una materia específica
export const listenForMessages = (materia, callback) => {
  // Nos unimos a un canal específico de la materia
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
