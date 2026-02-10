import { Router } from 'express'
import { recognizeImage } from '../controllers/arController.js'

const router = Router()

router.post('/recognize', recognizeImage)

export default router
