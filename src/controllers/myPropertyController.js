import express from 'express'
import { verifyUser } from '../middleware/userAuthentication.js'
import {
	getProperties,
	editProperty,
	removeProperty,
	updateStatus,
} from '../services/myPropertyServices.js'

const router = express.Router()
router.use(verifyUser)
router.route('/properties').get(getProperties)
router.route('/edit').patch(editProperty)
router.route('/update/status').patch(updateStatus)
router.route('/removeProperty/:propertyID').delete(removeProperty)
export default router
