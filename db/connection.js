import 'dotenv/config'
import mongoose from 'mongoose'

let dbUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.MONGODB_URI
    : process.env.MONGODB_LOCAL

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true)
}

mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch((error) => {
    console.error(`Error connecting to MongoDB: ${error.message}`)
    process.exit(1)
  })

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB has disconnected!')
  process.exit(1)
})

mongoose.connection.on('error', (error) => {
  console.error(`Error connecting to MongoDB: ${error}`)
  process.exit(1)
})

const db = mongoose.connection

export default db
