import { Schema, model } from 'mongoose'
import jwt from 'jsonwebtoken'
import { hashPassword, comparePassword, hashRefreshToken } from '../utils/userAuthentication.js'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../config/authSettings.js'

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
		tokens: [
			{
				token: {
					type: String,
					required: true,
				},
			},
		],
		resetPasswordToken: String,
		resetPasswordTokenExpiration: Date,
	},
	{
		timestamps: true,
		statics: {
			async userExists(email) {
				return this.findOne({ email })
			},
			async login(email, password) {
				const user = await this.findOne({ email })
				if (!user) throw new Error('Authentication Failed')
				const auth = await comparePassword(password, user.password)
				if (!auth) throw new Error('Authentication Failed')
				return user
			},
		},
		methods: {
			async generateAccessToken() {
				const accessToken = jwt.sign(
					{ userID: this.userID, name: this.userName, email: this.email },
					ACCESS_TOKEN.secret,
					{
						expiresIn: ACCESS_TOKEN.expiry,
					},
				)
				return accessToken
			},
			async generateRefreshToken() {
				const refreshToken = jwt.sign({ userID: this.userID }, REFRESH_TOKEN.secret, {
					expiresIn: REFRESH_TOKEN.expiry,
				})
				const hashedRefreshToken = hashRefreshToken(refreshToken)
				this.tokens.push({ token: hashedRefreshToken })
				await this.save()
				return refreshToken
			},
		},
	},
)
userSchema.pre('save', async function (next) {
	try {
		if (this.isModified('password')) {
			this.password = await hashPassword(this.password)
		}
		next()
	} catch (err) {
		next(err)
	}
})
export default model('user', userSchema)
