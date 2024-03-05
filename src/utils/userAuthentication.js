import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { REFRESH_TOKEN } from '../config/authSettings.js'

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt()
	const hash = await bcrypt.hash(password, salt)
	return hash
}
const comparePassword = async (password, hash) => {
	const result = await bcrypt.compare(password, hash)
	return result
}
const hashRefreshToken = (refreshToken) => {
	const hashedToken = crypto
		.createHmac('sha256', REFRESH_TOKEN.secret)
		.update(refreshToken)
		.digest('hex')
	return hashedToken
}
export { hashPassword, comparePassword, hashRefreshToken }
