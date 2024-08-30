import express from 'express'
import { verifyUser } from '../middleware/userAuthentication.js'
import { makePayment, getTransactions } from '../services/transactionServices.js'

const router = express.Router()

router.use(verifyUser)

router.route('/make').post(makePayment)
router.route('/transactions').get(getTransactions)
export default router
