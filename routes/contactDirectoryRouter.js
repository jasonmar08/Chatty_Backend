import { Router } from 'express'
import {
  createNewContact,
  getAllContactsByUserId
} from '../controllers/contactDirectory.js'
import { stripToken, verifyToken } from '../middleware/jwtAuth.js'
const router = Router()

router.get('/:userId/contacts', stripToken, verifyToken, getAllContactsByUserId)
router.post('/:userId/contacts', stripToken, verifyToken, createNewContact)

export default router
