import { Router } from 'express'
import { stripToken, verifyToken } from '../middleware/jwtAuth.js'
import {
  deleteUser,
  getAllChatThreads,
  getAllUsers,
  getOneUserById,
  updateUserInfo
} from '../controllers/user.js'
const router = Router()

// Standard CRUD
router.get('/users', stripToken, verifyToken, getAllUsers)
router.get('/users/:userId', stripToken, verifyToken, getOneUserById)
router.put('/users/:userId', stripToken, verifyToken, updateUserInfo)
router.delete('/users/:userId', stripToken, verifyToken, deleteUser)

// Chat Threads
router.get(
  '/users/:userId/messages',
  stripToken,
  verifyToken,
  getAllChatThreads
)

export default router
