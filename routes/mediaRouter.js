import { Router } from 'express'
import { getAllMedia } from '../controllers/media.js'
import { stripToken, verifyToken } from '../middleware/jwtAuth.js'
const router = Router()

router.get('/media', stripToken, verifyToken, getAllMedia)

export default router
