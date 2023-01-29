import { Router } from 'express'
import {
  checkSession,
  login,
  register,
  updatePassword
} from '../controllers/authUser.js'
import { stripToken, verifyToken } from '../middleware/jwtAuth.js'
const router = Router()

// Auth
router.post('/register', register)
router.post('/login', login)
router.patch(
  '/users/:userId/update-password',
  stripToken,
  verifyToken,
  updatePassword
)
router.get('/session', stripToken, verifyToken, checkSession)

export default router
