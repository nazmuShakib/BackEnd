import jwt from 'jsonwebtoken'
import UserModel from '../models/userModel.js'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../config/authSettings.js'

const checkUserExists = async (req, res, next) => {
	try {
		const { email } = req.body
		const checkUser = (await UserModel.userExists(email)) !== null
		if (checkUser) {
			res.status(409).json({
				message: 'User already exists',
			})
		} else {
			next()
		}
	} catch (err) {
		next(err)
	}
}
const verifyAccessTokenExpiration = async (req, res, next) => {
	try {
		const authHeader = req.header('Authorization')
		if (!authHeader?.startsWith('Bearer ')) {
			return res.status(403).json({ message: 'Forbidden' })
		}
		const splitToken = authHeader.split(' ')
		const accessToken = splitToken[1]
		jwt.verify(accessToken, ACCESS_TOKEN.secret)
		return res.status(401).json({
			message: 'False Token Expiration',
		})
	} catch (err) {
		if (err.name === 'TokenExpiredError') {
			return next()
		}
		return next(err)
	}
}
const verifyUser = async (req, res, next) => {
	try {
		const { cookies } = req
		if (!cookies[REFRESH_TOKEN.cookie.name]) {
			return res.status(401).json({
				message: 'Unauthorized',
			})
		}
		const authHeader = req.header('Authorization')
		if (!authHeader?.startsWith('Bearer ')) {
			return res.status(403).json({ message: 'Forbidden' })
		}
		const splitToken = authHeader.split(' ')
		const accessToken = splitToken[1]
		jwt.verify(accessToken, ACCESS_TOKEN.secret, (err, decode) => {
			if (err) throw err
			else {
				req.user = decode
			}
		})
		return next()
	} catch (err) {
		if (err.name === 'TokenExpiredError') {
			return res.status(401).json({
				message: 'Token expired',
			})
		}
		return res.status(400).json({
			message: 'Bad request',
		})
	}
}
export { checkUserExists, verifyAccessTokenExpiration, verifyUser }
