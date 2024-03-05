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
		const { email, password } = req.body
		const user = await UserModel.login(email, password)
		const accessToken = await user.generateAccessToken()
		const refreshToken = await user.generateRefreshToken()
		res
			.cookie(REFRESH_TOKEN.cookie.name, refreshToken, REFRESH_TOKEN.cookie.options)
			.status(200)
			.json({
				message: 'Login successful',
				accessToken,
			})
	} catch (err) {
		res.status(401).json({
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
		user.tokens = user.tokens.filter((token) => token !== hashedRefreshToken)
		await user.save()
		res.clearCookie(REFRESH_TOKEN.cookie.name).status(200).json({
			message: 'Successfully logged out',
		})
	} catch (err) {
		res.status(500).json({
			message: err.message,
		})
	}
}
export { addUser, userLogin, userLogout }
