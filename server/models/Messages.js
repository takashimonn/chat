import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  materia: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['normal', 'urgente'],
    default: 'normal'
  },
  status: {
    type: String,
    enum: ['en espera', 'visto', 'respondido'],
    default: 'en espera'
  }
}, {
  timestamps: true
});

const Message = mongoose.model('messages', messageSchema);

export default Message;
