import UserModel from '../models/userModel.js'
import { getNanoID } from '../utils/uniqueIdGenerator.js'
import { comparePassword } from '../utils/userAuthentication.js'

const addUser = async (req, res) => {
	try {
		const { password, ...data } = req.body
		const userID = getNanoID(22)
		const newUser = new UserModel({
			userID,
			...data,
			password,
		})
		await newUser.save()
		res.status(201).send('Success')
	} catch (err) {
		res.status(500).json({
			message: err.message,
		})
	}
}
const userLogin = async (req, res) => {
	try {
		const { email, password } = req.body
		const user = await UserModel.findUser(email)
		if (!user) {
			res.status(404).json({ message: 'User not found' })
		} else {
			const passwordCheck = await comparePassword(password, user.password)
			if (!passwordCheck) {
				res.status(401).json({
					message: 'Authentication failed',
				})
			} else {
				res.status(200).json({
					data: user,
				})
			}
		}
	} catch (err) {
		res.status(401).json({
			message: 'Authentication Failed',
		})
	}
}
export { addUser, userLogin }
