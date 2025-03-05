import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
    const { usuario, contrasena } = req.body;

    try {
        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ usuario });
        if (usuarioExistente) {
            return res.status(400).json({ message: "El usuario ya está registrado" });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        
        // Crear un nuevo usuario
        const nuevoUsuario = new Usuario({ usuario, contrasena: hashedPassword });
        await nuevoUsuario.save();

        // Responder con un mensaje de éxito
        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        // Manejo de errores
        if (error.code === 11000) {
            return res.status(400).json({ message: "El usuario ya está registrado" });
        }
        res.status(500).json({ message: "Error en el servidor", error });
    }
});

// Login de usuario
router.post('/login', async (req, res) => {
    const { usuario, contrasena } = req.body;

    try {
        const usuarioDB = await Usuario.findOne({ usuario });
        if (!usuarioDB) return res.status(401).json({ message: "Usuario no encontrado" });

        const esValida = await bcrypt.compare(contrasena, usuarioDB.contrasena);
        if (!esValida) return res.status(401).json({ message: "Contraseña incorrecta" });

        const token = jwt.sign({ id: usuarioDB._id, usuario: usuarioDB.usuario }, "secreto", { expiresIn: "1h" });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
});

export default router;
