import express from 'express'
import logger from 'morgan'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

import authRoutes from './routes/auth.js'

dotenv.config()

const port = process.env.PORT ?? 3000
const mongoUri = process.env.MONGO_URI


mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err))

const messageSchema = new mongoose.Schema({
    text: String,
    createdAt: { type: Date, default: Date.now }
})

const Message = mongoose.model('Message', messageSchema)

const app = express()
app.use(express.json()) 
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST']
}))

app.use(logger('dev'))


app.use('/auth', authRoutes)

const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:3001'],
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
    console.log('a user has connected!')

    socket.on('disconnect', () => {
        console.log('a user has disconnected')
    })

    socket.on('chat message', async (msg) => {
        const message = new Message({ text: msg })
        await message.save()
        io.emit('chat message', msg)
    })
})

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(port, () => {
    console.log(`server running on port ${port}`)
})
