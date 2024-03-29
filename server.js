import 'dotenv/config'
import db from './db/connection.js'
import express from 'express'
import logger from 'morgan'
import cors from 'cors'
import routes from './routes/index.js'
import { Server } from 'socket.io'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use(logger('dev'))
app.use(routes)

db.on('connected', () => {
  console.log('Connected to MongoDB!')
  const server = app
    .listen(PORT, () => {
      console.log(`Express server application is running on port: ${PORT}\n\n`)
    })
    .on('error', (err) => {
      console.error(`Express server error: ${err}`)
      process.exit(1)
    })
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: 'http://localhost:3001'
    }
  })
  io.on('connection', (socket) => {
    console.log('Connected to socket.io')
  })
})

db.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`)
  process.exit(1)
})
