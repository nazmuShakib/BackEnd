import express from 'express'
import { addUser, userLogin, userLogout, refreshAccessToken } from '../services/userServices.js'
import {
	checkUserExists,
	verifyUser,
	verifyAccessTokenExpiration,
} from '../middleware/userAuthentication.js'

const router = express.Router()

router.route('/register').post(checkUserExists, addUser)
router.route('/login').post(userLogin)
router.route('/logout').get(verifyUser, userLogout)
router.route('/refreshToken').get(verifyAccessTokenExpiration, refreshAccessToken)
export default router
