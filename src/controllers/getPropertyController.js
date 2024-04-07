import express from 'express'
import { getProperty, getPropertyByID, getMyProperties } from '../services/getPropertyServices.js'
import { verifyUser } from '../middleware/userAuthentication.js'

const router = express.Router()

router.route('/').get(getProperty)
router.route('/my-properties').get(verifyUser, getMyProperties)
router.route('/:propertyID').get(getPropertyByID)

export default router
