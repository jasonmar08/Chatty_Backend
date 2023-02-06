import { Router } from 'express'
import {
  createMessage,
  deleteMessageThread,
  getAllMessages,
  getAllMessageThreads
} from '../controllers/privateChat.js'
import { stripToken, verifyToken } from '../middleware/jwtAuth.js'
const router = Router()

router.post('/:userId/privateChats', stripToken, verifyToken, createMessage)
router.get(
  '/:userId/privateChats',
  stripToken,
  verifyToken,
  getAllMessageThreads
)
router.get(
  '/:userId/privateChats/:privateChatId',
  stripToken,
  verifyToken,
  getAllMessages
)
router.delete(
  '/:userId/privateChats/:privateChatId',
  stripToken,
  verifyToken,
  deleteMessageThread
)

export default router
