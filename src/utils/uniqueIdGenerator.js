import { urlAlphabet, customRandom } from 'nanoid'
import crypto from 'crypto'

const getRandom = (size) => crypto.randomBytes(size)

const getNanoID = (length) => customRandom(urlAlphabet, length, getRandom)()

export default getNanoID
