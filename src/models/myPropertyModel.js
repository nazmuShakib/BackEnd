import { Schema, model } from 'mongoose'

const MyPropertySchema = Schema({
	userID: {
		type: String,
		required: true,
	},
	property: {
		type: Schema.Types.ObjectId,
		ref: 'property',
	},
})

export default model('myProperty', MyPropertySchema)
