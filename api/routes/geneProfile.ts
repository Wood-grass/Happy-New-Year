import { Router } from 'express'
import { generateProfile } from '../controllers/geneProfileController.js'

const router = Router()

router.post('/generate', generateProfile)

export default router
