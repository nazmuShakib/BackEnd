import express from 'express'
import { addUser, userLogin, userLogout } from '../services/userServices.js'
import { checkUserExists, verifyUser } from '../middleware/userAuthentication.js'

const router = express.Router()

router.route('/register').post(checkUserExists, addUser)
router.route('/login').post(userLogin)
router.route('/logout').get(verifyUser, userLogout)
export default router
