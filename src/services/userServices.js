import jwt from 'jsonwebtoken'
import UserModel from '../models/userModel.js'
import { getNanoID } from '../utils/uniqueIdGenerator.js'
import { REFRESH_TOKEN } from '../config/authSettings.js'
import { hashRefreshToken } from '../utils/userAuthentication.js'

const addUser = async (req, res) => {
	try {
		const data = req.body
		const userID = getNanoID(22)
		const newUser = new UserModel({
			userID,
			...data,
		})
		await newUser.save()
		const accessToken = await newUser.generateAccessToken()
		const refreshToken = await newUser.generateRefreshToken()
		res
			.cookie(REFRESH_TOKEN.cookie.name, refreshToken, REFRESH_TOKEN.cookie.options)
			.status(201)
			.json({
				message: 'New user created successfully',
				accessToken,
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
		const accessToken = await user.generateAccessToken()
		const refreshToken = await user.generateRefreshToken()
		return res
			.cookie(REFRESH_TOKEN.cookie.name, refreshToken, REFRESH_TOKEN.cookie.options)
			.status(200)
			.json({
				message: 'Login successful',
				accessToken,
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
		console.log(cookies)
		if (!cookies[REFRESH_TOKEN.cookie.name]) {
			return res.status(400).json({
				message: 'Authentication Failed',
			})
			// throw new Error('Authentication Failed')
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
		})
	} catch (err) {
		return res.status(401).json({ message: err.message })
	}
}
export { addUser, userLogin, userLogout, refreshAccessToken }
