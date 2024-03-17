import express from 'express'
import { addUser, userLogin, userLogout, refreshAccessToken } from '../services/userServices.js'
import {
	checkUserExists,
	verifyUser,
	verifyAccessTokenExpiration,
} from '../middleware/userAuthentication.js'
import signUpValidator from '../middleware/signUpValidation.js'

const router = express.Router()

router.route('/register').post(signUpValidator, checkUserExists, addUser)
router.route('/login').post(userLogin)
router.route('/logout').get(verifyUser, userLogout)
router.route('/refreshToken').get(refreshAccessToken)
export default router
