import { Router } from 'express'
import {
  createMediaMessage,
  deleteMediaById,
  getChatMediaByFileType,
  getMediaByChatId
} from '../controllers/media.js'
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

// Media Messages
router.post(
  '/:userId/privateChats/:privateChatId/media',
  stripToken,
  verifyToken,
  createMediaMessage
)
router.get(
  '/privateChats/:privateChatId/media',
  stripToken,
  verifyToken,
  getMediaByChatId
)
router.get(
  '/privateChats/:privateChatId/media/:fileType',
  stripToken,
  verifyToken,
  getChatMediaByFileType
)
router.delete(
  '/privateChats/media/:mediaId',
  stripToken,
  verifyToken,
  deleteMediaById
)

export default router
