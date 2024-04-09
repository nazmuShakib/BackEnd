import express from 'express'
import { verifyUser } from '../middleware/userAuthentication.js'
import { getProperties, editProperty, removeProperty } from '../services/myPropertyServices.js'

const router = express.Router()
router.use(verifyUser)
router.route('/properties').get(getProperties)
router.route('/edit').put(editProperty)
router.route('/removeProperty/:propertyID').delete(removeProperty)
export default router
