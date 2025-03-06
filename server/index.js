import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import Message from './models/Messages.js';

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;
const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST']
}));

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('A user has connected!');

  socket.on('join room', (materia) => {
    socket.join(materia);
    console.log(`User joined the room: ${materia}`);
  });

  socket.on('chat message', async (msg) => {
    const { text, materia, priority } = msg;
    if (!text || !materia) {
      socket.emit('error', 'Texto o materia faltante');
      return;
    }

    try {
      // Buscar el último mensaje "visto" para cambiar su estado a "respondido"
      const previousMessage = await Message.findOne({ materia, status: 'visto' }).sort({ createdAt: -1 });

      if (previousMessage) {
        previousMessage.status = 'respondido';
        await previousMessage.save();
        io.to(materia).emit('chat message', previousMessage);
      }

      // Crear y guardar el nuevo mensaje con estado "en espera"
      const message = new Message({
        text,
        materia,
        priority,
        status: 'en espera'
      });

      await message.save();
      io.to(materia).emit('chat message', message);

      // Actualizar el estado del nuevo mensaje a "visto"
      message.status = 'visto';
      await message.save();
      io.to(materia).emit('chat message', message);

    } catch (error) {
      console.error('Error al procesar el mensaje:', error);
      socket.emit('error', 'Error al procesar el mensaje');
    }
  });

  socket.on('disconnect', () => {
    console.log('A user has disconnected');
  });
});

app.get('/messages/:materia', async (req, res) => {
  const { materia } = req.params;
  try {
    const messages = await Message.find({ materia }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.error('Error al obtener los mensajes:', error);
    res.status(500).json({ error: 'Error al obtener los mensajes' });
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
