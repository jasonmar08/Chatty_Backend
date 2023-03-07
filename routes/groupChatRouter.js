import { Router } from 'express'
import {
  createGroupChat,
  createGroupChatMessage,
  deleteGChat,
  deleteGroupChatThread,
  deleteMessage,
  GetAllGChats,
  getAllGroupChatsByUserId,
  getGroupChatByChatId,
  leaveGroupChat,
  updateGroupChatInfo
} from '../controllers/groupChat.js'
import {
  createMediaMessage,
  getChatMediaByFileType,
  getMediaByChatId
} from '../controllers/media.js'
import { stripToken, verifyToken } from '../middleware/jwtAuth.js'
const router = Router()

router.get('/groupChats', stripToken, verifyToken, GetAllGChats)
router.post('/:userId/groupChats', stripToken, verifyToken, createGroupChat)
router.post(
  '/:userId/groupChats/:groupChatId',
  stripToken,
  verifyToken,
  createGroupChatMessage
)
router.get(
  '/:userId/groupChats',
  stripToken,
  verifyToken,
  getAllGroupChatsByUserId
)
router.get(
  '/groupChats/:groupChatId',
  stripToken,
  verifyToken,
  getGroupChatByChatId
)
router.put(
  '/:userId/groupChats/:groupChatId',
  stripToken,
  verifyToken,
  updateGroupChatInfo
)
router.delete(
  '/:userId/groupChats/:groupChatId',
  stripToken,
  verifyToken,
  deleteGroupChatThread
)
router.put('/:userId/:groupChatId', stripToken, verifyToken, leaveGroupChat)
router.delete('/groupChats/:chatId', deleteGChat)
router.delete('/groupChats/:groupChatId/messages', deleteMessage)

// Media Messages
router.post(
  '/:userId/groupChats/:groupChatId/media',
  stripToken,
  verifyToken,
  createMediaMessage
)
router.get(
  '/groupChats/:groupChatId/media',
  stripToken,
  verifyToken,
  getMediaByChatId
)
router.get(
  '/groupChats/:groupChatId/media/:fileType',
  stripToken,
  verifyToken,
  getChatMediaByFileType
)

export default router
