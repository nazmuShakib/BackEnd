import { urlAlphabet, customRandom } from 'nanoid'
import crypto from 'crypto'

const getRandom = (size) => crypto.randomBytes(size)

const getNanoID = (length) => customRandom(urlAlphabet, length, getRandom)()

const getImageHash = (data, secret) => {
	const hash = crypto.createHash('sha256', secret)
	hash.update(data)
	const digest = hash.digest('hex')
	return digest
}
export { getNanoID, getImageHash }
