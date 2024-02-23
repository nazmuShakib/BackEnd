import express from 'express'
import { getProperty, getPropertyByID } from '../services/getPropertyServices.js'

const router = express.Router()

router.route('/').get(getProperty)
router.route('/:propertyID').get(getPropertyByID)

export default router
