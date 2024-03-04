import bcrypt from 'bcrypt'

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt()
	const hash = await bcrypt.hash(password, salt)
	return hash
}
const comparePassword = async (password, hash) => {
	const result = await bcrypt.compare(password, hash)
	return result
}
export { hashPassword, comparePassword }
