import jwt from 'jsonwebtoken'
import UserModel from '../models/userModel.js'
import { ACCESS_TOKEN } from '../config/authSettings.js'

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
const verifyUser = async (req, res, next) => {
	try {
		const authHeader = req.header('Authorization')
		if (!authHeader?.startsWith('Bearer ')) {
			return res.status(403).json({ message: 'Forbidden' })
		}
		const splitToken = authHeader.split(' ')
		const accessToken = splitToken[1]
		jwt.verify(accessToken, ACCESS_TOKEN.secret, (err, decode) => {
			if (err) throw new Error('Authentication Failed')
			else {
				req.user = decode
			}
		})
		return next()
	} catch (err) {
		return res.json({
			message: 'Authentication Failed',
		})
		// if (err.name === 'TokenExpiredError') {
		// }
		// next(err)
	}
}
export { checkUserExists, verifyUser }
