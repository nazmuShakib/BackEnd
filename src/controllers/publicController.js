import express from 'express'
import getPropertiesByUserID from '../services/publicServices.js'

const router = express.Router({ strict: true })

router.route('/get/properties/:userID').get(getPropertiesByUserID)
export default router
