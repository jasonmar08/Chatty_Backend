import { Router } from 'express'
// import middleware from '../middleware/jwtAuth.js'
import { login, register } from '../controllers/authUser.js'
const router = Router()

// Auth
router.post('/register', register)
router.post('/login', login)

export default router
