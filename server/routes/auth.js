import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'

const router = express.Router()

// Registro de usuario
router.post('/register', async (req, res) => {
    const { usuario, contrasena } = req.body

    try {
        const hashedPassword = await bcrypt.hash(contrasena, 10)
        const nuevoUsuario = new Usuario({ usuario, contrasena: hashedPassword })
        await nuevoUsuario.save()

        res.status(201).json({ message: "Usuario registrado exitosamente" })
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error })
    }
})

// Login de usuario
router.post('/login', async (req, res) => {
    const { usuario, contrasena } = req.body

    try {
        const usuarioDB = await Usuario.findOne({ usuario })
        if (!usuarioDB) return res.status(401).json({ message: "Usuario no encontrado" })

        const esValida = await bcrypt.compare(contrasena, usuarioDB.contrasena)
        if (!esValida) return res.status(401).json({ message: "Contraseña incorrecta" })

        const token = jwt.sign({ id: usuarioDB._id, usuario: usuarioDB.usuario }, "secreto", { expiresIn: "1h" })

        res.json({ token })
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" })
    }
})

export default router
