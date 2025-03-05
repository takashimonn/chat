import express from 'express';
import logger from 'morgan';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.js';

dotenv.config();

const port = process.env.PORT ?? 3000;
const mongoUri = process.env.MONGO_URI;

// Conexión a MongoDB
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Definición del esquema y modelo para los mensajes
const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },  // Asegúrate de que "text" sea requerido
  materia: { type: String, required: true },  // Asegúrate de que "materia" sea requerido
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST']
}));

app.use(logger('dev'));
app.use('/auth', authRoutes);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST']
  }
});

// Conexión del socket
io.on('connection', (socket) => {
  console.log('A user has connected!');

  socket.on('disconnect', () => {
    console.log('A user has disconnected');
  });

  // Unirse a una sala según la materia seleccionada
  socket.on('join room', (materia) => {
    socket.join(materia);
    console.log(`User joined the room: ${materia}`);
  });

  // Escuchar el mensaje de chat
  socket.on('chat message', async (msg) => {
    const { text, materia } = msg;  // Desestructuramos el mensaje

    // Validar que ambos campos estén presentes
    if (!text || !materia) {
      console.error('Texto o materia faltante');
      socket.emit('error', 'Texto o materia faltante');  // Emite el error al cliente
      return;
    }

    // Crear un nuevo mensaje con texto y materia
    const message = new Message({
      text: text,      // Guarda el texto del mensaje
      materia: materia // Guarda la materia del mensaje
    });

    console.log('Saving message:', message); // Log para ver qué estamos intentando guardar

    try {
      await message.save();  // Guarda el mensaje en la base de datos
      console.log('Message saved:', message);
      io.to(materia).emit('chat message', { text, materia });  // Emite el mensaje a todos los clientes en la sala de la materia
    } catch (error) {
      console.error('Error al guardar el mensaje:', error);
      socket.emit('error', 'Error al guardar el mensaje');
    }
  });

  socket.on('chat message', async (msg) => {
    const { text, materia } = msg;
  
    if (!text || !materia) {
      console.error('Texto o materia faltante');
      socket.emit('error', 'Texto o materia faltante');
      return;
    }
  
    const message = new Message({
      text: text,
      materia: materia
    });
  
    try {
      await message.save();
      io.to(materia).emit('chat message', { text, materia });
    } catch (error) {
      console.error('Error al guardar el mensaje:', error);
    }
  });
  
});

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html');
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
