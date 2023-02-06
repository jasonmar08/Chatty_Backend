import { Router } from 'express'
import {
  createGroupChat,
  createGroupChatMessage,
  deleteGroupChatThread,
  getAllGroupChatThreads,
  leaveGroupChat,
  updateGroupChatInfo
} from '../controllers/groupChat.js'
import { stripToken, verifyToken } from '../middleware/jwtAuth.js'
const router = Router()

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
  getAllGroupChatThreads
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

export default router
