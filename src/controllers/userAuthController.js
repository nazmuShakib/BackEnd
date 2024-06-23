import express from 'express'
import {
	addUser,
	userLogin,
	userLogout,
	refreshAccessToken,
	verifyEmail,
	forgetPassword,
	resetPassword,
	sendResetPasswordLink,
} from '../services/userAuthServices.js'
import { checkUserExists, verifyUser } from '../middleware/userAuthentication.js'
import signUpValidator from '../middleware/signUpValidation.js'
import {
	forgetPasswordEmailValidator,
	resetPasswordValidator,
} from '../middleware/formValidation.js'

const router = express.Router()

router.route('/register').post(signUpValidator, checkUserExists, addUser)
router.route('/login').post(userLogin)
router.route('/logout').post(verifyUser, userLogout)
router.route('/refreshToken').get(refreshAccessToken)
router.route('/verify/:token').get(verifyEmail)
router.route('/password/forget').post(forgetPasswordEmailValidator, forgetPassword)
router.route('/password/reset/:token').get(sendResetPasswordLink)
router.route('/password/reset').post(resetPasswordValidator, resetPassword)

export default router
