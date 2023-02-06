import { Router } from 'express'
import authUserRouter from './authUserRouter.js'
import userRouter from './userRouter.js'
import contactDirectoryRouter from './contactDirectoryRouter.js'
import privateChatRouter from './privateChatRouter.js'
const router = Router()

router.get('/', (req, res) => res.send('This is the root page!'))
router.use('/', authUserRouter)
router.use('/', userRouter)
router.use('/', contactDirectoryRouter)
router.use('/', privateChatRouter)

export default router
