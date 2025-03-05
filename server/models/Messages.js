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
  }
}, {
  timestamps: true
});

const Message = mongoose.model('messages', messageSchema);

export default Message;
