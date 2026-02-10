import { Router } from 'express'
import { getHeritageList } from '../controllers/heritageController.js'

const router = Router()

router.get('/list', getHeritageList)

export default router
