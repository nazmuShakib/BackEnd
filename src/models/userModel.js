import { Schema, model } from 'mongoose'
import { hashPassword } from '../utils/userAuthentication.js'

const userSchema = new Schema(
	{
		userID: {
			type: String,
			required: true,
		},
		userName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
		statics: {
			async userExists(email) {
				return this.findOne({ email })
			},
			async findUser(email) {
				return this.findOne({ email }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 })
			},
		},
	},
)
userSchema.pre('save', async function (next) {
	try {
		this.password = await hashPassword(this.password)
		next()
	} catch (err) {
		next(err)
	}
})
export default model('user', userSchema)
