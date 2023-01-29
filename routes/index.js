import { Router } from 'express'
import userRouter from './userRouter.js'
const router = Router()

router.get('/', (req, res) => res.send('This is the root page!'))
router.use('/', userRouter)

export default router
