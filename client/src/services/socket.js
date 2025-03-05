import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

export const sendMessage = (message) => {
  console.log('Sending message:', message);
  socket.emit('chat message', message);
};

export const listenForMessages = (materia, callback) => {
  socket.emit('join room', materia);
  socket.on('chat message', (msg) => {
    if (msg.materia === materia) {
      callback(msg);
    }
  });
};

export const disconnectSocket = () => {
  socket.off('chat message');
  socket.disconnect(); 
};


export default socket;
