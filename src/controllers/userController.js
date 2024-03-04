import express from 'express'
import { addUser, userLogin } from '../services/userServices.js'
import checkUserExists from '../middleware/userAuthentication.js'

const router = express.Router()

router.route('/').post(checkUserExists, addUser)
router.route('/login').post(userLogin)

export default router
