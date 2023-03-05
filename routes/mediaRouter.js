import { Router } from 'express'
import { deleteMediaById, getAllMedia } from '../controllers/media.js'
import { stripToken, verifyToken } from '../middleware/jwtAuth.js'
const router = Router()

router.get('/media', stripToken, verifyToken, getAllMedia)
router.delete('/media/:mediaId', stripToken, verifyToken, deleteMediaById)

export default router
