import { z } from 'zod'

const SignUpSchema = z.object({
	username: z
		.string()
		.max(100, 'used more than 100 characters')
		.refine((name) => name.trimEnd().trimStart() !== '', 'User Name required'),
	email: z.string().email('Invalid email address'),
	password: z
		.string()
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&])[A-Za-z!@#$%&\d]+$/,
			"Password doesn't contain a lowercase, uppercase and special character",
		)
		.regex(/^[A-Za-z!@#$%&\d]+$/, 'Invalid characters')
		.min(8, 'Password must be at least 8 characters'),
})

const signUpValidator = (req, res, next) => {
	try {
		const data = req.body
		// const parsedData = JSON.parse(data)
		// console.log(data)
		SignUpSchema.parse(data)
		next()
	} catch (err) {
		next(err)
	}
}
export default signUpValidator
