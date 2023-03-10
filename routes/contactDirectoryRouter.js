import { Router } from 'express'
import {
  createNewContact,
  deleteOneContact,
  getAllContacts,
  getAllContactsByUserId,
  getAllFavoriteContacts,
  getOneContact,
  updateContact
} from '../controllers/contactDirectory.js'
import { stripToken, verifyToken } from '../middleware/jwtAuth.js'
const router = Router()

router.get('/contacts', stripToken, verifyToken, getAllContacts)
router.get('/:userId/contacts', stripToken, verifyToken, getAllContactsByUserId)
router.post('/:userId/contacts', stripToken, verifyToken, createNewContact)
router.get(
  '/:userId/contacts/:contactId',
  stripToken,
  verifyToken,
  getOneContact
)
router.put(
  '/:userId/contacts/:contactId',
  stripToken,
  verifyToken,
  updateContact
)
router.delete(
  '/:userId/contacts/:contactId',
  stripToken,
  verifyToken,
  deleteOneContact
)
router.get(
  '/:userId/favorite-contacts',
  stripToken,
  verifyToken,
  getAllFavoriteContacts
)

export default router
