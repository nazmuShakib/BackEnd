import UserModel from '../models/userModel.js'

const checkUserExists = async (req, res, next) => {
	try {
		const { email } = req.body
		console.log(email)
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
export default checkUserExists
