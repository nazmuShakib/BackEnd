import express from 'express'
import getPropertiesByUserID from '../services/publicServices.js'
import { successfulPayment, failedPayment, ipnPayment } from '../services/transactionServices.js'

const router = express.Router({ strict: true })

router.route('/get/properties/:userID').get(getPropertiesByUserID)
router.route('/payment/success/:transactionID/:userID').post(successfulPayment)
router.route('/payment/fail/:transactionID/:userID').post(failedPayment)
router.route('/payment/cancel/:transactionID/:userID').post(failedPayment)
router.route('/payment/ipn/:transactionID/:userID').get(ipnPayment)

export default router
