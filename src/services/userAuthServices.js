import jwt from 'jsonwebtoken'
import UserModel from '../models/userModel.js'
import { getNanoID } from '../utils/uniqueIdGenerator.js'
import { REFRESH_TOKEN } from '../config/authSettings.js'
import { hashRefreshToken } from '../utils/userAuthentication.js'
import sendMail from '../utils/mailSender.js'

const addUser = async (req, res) => {
	try {
		const data = req.body
		const userID = getNanoID(22)
		const newUser = new UserModel({
			userID,
			...data,
		})
		const token = jwt.sign({ data: userID }, process.env.SEND_EMAIL_SECRET, { expiresIn: '1h' })
		await sendMail(data.email, process.env.VERIFY_EMAIL, token)
		await newUser.save()
		res.status(201).json({
			message: 'An email has been sent. Please verify your email.',
		})
	} catch (err) {
		res.status(500).json({
			message: err.message,
		})
	}
}
const userLogin = async (req, res) => {
	try {
		const { cookies } = req
		if (cookies[REFRESH_TOKEN.cookie.name]) {
			return res.status(400).json({
				message: 'Your are logged in',
			})
		}
		const { email, password } = req.body
		const user = await UserModel.login(email, password)
		user.resetPasswordToken = []
		await user.save()
		const accessToken = await user.generateAccessToken()
		const refreshToken = await user.generateRefreshToken()
		return res
			.cookie(REFRESH_TOKEN.cookie.name, refreshToken, REFRESH_TOKEN.cookie.options)
			.status(200)
			.json({
				message: 'Login successful',
				accessToken,
				userID: user.userID,
			})
	} catch (err) {
		return res.status(401).json({
			message: err.message,
		})
	}
}
const userLogout = async (req, res) => {
	try {
		const { userID } = req.user
		const user = await UserModel.findOne({ userID })
		const refreshToken = req?.cookies[REFRESH_TOKEN.cookie.name]
		const hashedRefreshToken = hashRefreshToken(refreshToken)
		user.tokens = user.tokens.filter((tokenObj) => tokenObj.token !== hashedRefreshToken)
		await user.save()
		res.clearCookie(REFRESH_TOKEN.cookie.name).status(200).json({
			message: 'Successfully logged out',
		})
	} catch (err) {
		res.status(400).json({
			message: 'Bad request',
		})
	}
}
const refreshAccessToken = async (req, res) => {
	try {
		const { cookies } = req
		if (!cookies[REFRESH_TOKEN.cookie.name]) {
			return res.status(401).json({
				message: 'Unauthorized',
			})
		}
		const refreshToken = cookies[REFRESH_TOKEN.cookie.name]
		const decode = jwt.verify(refreshToken, REFRESH_TOKEN.secret)
		const user = await UserModel.findOne({ userID: decode.userID })
		if (!user) {
			return res.status(403).json({ message: 'Authentication Failed' })
		}
		await user.save()
		const newAccessToken = await user.generateAccessToken()
		res.status(201)
		res.set({ 'Cache-Control': 'no-store', Pragma: 'no-cache' })
		return res.json({
			message: 'Renewed access token',
			accessToken: newAccessToken,
			userID: user.userID,
		})
	} catch (err) {
		return res.status(401).json({ message: err.message })
	}
}
const verifyEmail = async (req, res) => {
	try {
		const { token } = req.params
		console.log(token)
		const decode = jwt.verify(token, process.env.SEND_EMAIL_SECRET)
		const user = await UserModel.userIDExists(decode.data)
		if (!user) {
			throw new Error('User not found')
		}
		user.verifyUser()
		res.redirect(process.env.LOGIN_PAGE_URL)
		// const accessToken = await user.generateAccessToken()
		// const refreshToken = await user.generateRefreshToken()
		// res.cookie(REFRESH_TOKEN.cookie.name, refreshToken, REFRESH_TOKEN.cookie.options)
	} catch (err) {
		console.log(err)
		res.redirect(process.env.HOME_PAGE_URL)
	}
}
const forgetPassword = async (req, res) => {
	console.log('forget password')
	const { email } = req.body
	const token = jwt.sign({ email }, process.env.SEND_EMAIL_SECRET, { expiresIn: '10m' })
	try {
		const user = await UserModel.userExists(email)
		if (!user) return res.status(400).json({ message: 'User not found' })
		await sendMail(email, process.env.RESET_PASSWORD, token)
		user.resetPasswordToken.push(token)
		await user.save()
		console.log('ok')
		return res.status(200).json({
			message: 'An email has been sent. Please click on the link to reset password.',
		})
	} catch (err) {
		console.log(err)
		return res.status(400).json({
			message: 'There was an error.',
		})
	}
}
const sendResetPasswordLink = async (req, res) => {
	console.log('reset password link')
	const { token } = req.params
	console.log(token)
	try {
		const decode = jwt.verify(token, process.env.SEND_EMAIL_SECRET)
		console.log(decode)
		const user = await UserModel.userExists(decode.email)
		if (!user) throw new Error('User not found')
		// const tokenExists = user.resetPasswordToken.find((tkn) => tkn === token)
		// if (!tokenExists) throw new Error('Unable to reset password')
		console.log(`${process.env.RESET_PASSWORD_FRONTEND}/${user.userID}/${token}`)
		res.redirect(`${process.env.RESET_PASSWORD_FRONTEND}/${user.userID}/${token}`)
	} catch (err) {
		console.log(err)
		res.redirect(process.env.RESET_PASSWORD_FAILURE)
	}
}
const resetPassword = async (req, res) => {
	console.log('reset password')
	const { password, userID, token } = req.body
	try {
		const user = await UserModel.userIDExists(userID)
		if (!user) throw new Error('User not found')
		const tokenExists = user.resetPasswordToken.find((tkn) => tkn === token)
		if (!tokenExists) throw new Error('Unable to reset password')
		user.password = password
		user.resetPasswordToken = user.resetPasswordToken.filter((tkn) => tkn !== token)
		await user.save()
		res.status(200).json({
			message: 'Password reset successful',
		})
	} catch (err) {
		console.log(err)
		res.status(400).json({
			message: err.message,
		})
	}
}

export {
	addUser,
	userLogin,
	userLogout,
	refreshAccessToken,
	verifyEmail,
	forgetPassword,
	resetPassword,
	sendResetPasswordLink,
}
