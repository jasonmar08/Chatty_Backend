import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS)
const APP_SECRET = process.env.APP_SECRET

// Hashing Passwords
export const hashPassword = async (password) => {
  // Accepts a password from the request body
  let hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
  // Creates a hashed password and encrypts it 12 times
  return hashedPassword
}

// Comparing Passwords
export const comparePassword = async (storedPassword, plainTextPassword) => {
  // Accepts the password provided in the login request and the currently stored password
  // Compares the two passwords for a match
  let passwordMatch = await bcrypt.compare(plainTextPassword, storedPassword)
  // returns true if the passwords match
  // returns false if the passwords are not a match
  return passwordMatch
}

// Creating JWT Tokens
export const createToken = (payload) => {
  // Accepts a payload with which to create the token
  let token = jwt.sign(payload, APP_SECRET)
  // Generates the token and encrypts it, returns the token when the process finishes
  return token
}

// Helper function for getting user information from a decoded token
export const getUserFromToken = (token) => {
  try {
    let payload = jwt.verify(token, APP_SECRET)
    return payload.user
  } catch (error) {
    return null
  }
}

// Verifying JWT Tokens
export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers['authorization'].split(' ')[1]
    if (!token) throw new Error('Token not found in headers')
    let payload = jwt.verify(token, APP_SECRET)
    if (payload) {
      req.user = payload.user
      return next()
    }
    throw new Error('Invalid token')
  } catch (error) {
    res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
  }
}

// Reading Tokens
export const stripToken = (req, res, next) => {
  try {
    const token = req.headers['authorization'].split(' ')[1]
    if (token) {
      res.locals.token = token
      return next()
    }
  } catch (error) {
    res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
  }
}
