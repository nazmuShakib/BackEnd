import express from 'express'
import { verifyUser } from '../middleware/userAuthentication.js'
import { makePayment } from '../services/transactionServices.js'

const router = express.Router()

router.use(verifyUser)

router.route('/make').post(makePayment)
export default router
