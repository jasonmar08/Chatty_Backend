import { Router } from 'express'
import authUserRouter from './authUserRouter.js'
import userRouter from './userRouter.js'
import contactDirectoryRouter from './contactDirectoryRouter.js'
import privateChatRouter from './privateChatRouter.js'
import groupChatRouter from './groupChatRouter.js'
import mediaRouter from './mediaRouter.js'
const router = Router()

router.get('/', (req, res) => res.send('This is the root page!'))
router.use('/', authUserRouter)
router.use('/', userRouter)
router.use('/', contactDirectoryRouter)
router.use('/', privateChatRouter)
router.use('/', groupChatRouter)
router.use('/', mediaRouter)

export default router
