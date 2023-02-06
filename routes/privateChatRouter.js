import { Router } from 'express'
import {
  createMessage,
  deleteMessageThread,
  getAllMessages,
  getAllMessageThreads
} from '../controllers/privateChat.js'
import { stripToken, verifyToken } from '../middleware/jwtAuth.js'
const router = Router()

router.post('/:userId/messages', stripToken, verifyToken, createMessage)
router.get('/:userId/messages', stripToken, verifyToken, getAllMessageThreads)
router.get(
  '/:userId/messages/:privateChatId',
  stripToken,
  verifyToken,
  getAllMessages
)
router.delete(
  '/:userId/messages/:privateChatId',
  stripToken,
  verifyToken,
  deleteMessageThread
)

export default router
