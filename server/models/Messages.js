const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true  // Asegura que 'text' sea obligatorio
  },
  materia: {
    type: String,
    required: true  // Asegura que 'materia' sea obligatorio
  },
});

const Message = mongoose.model('messages', messageSchema);

module.exports = Message;
