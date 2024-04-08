import { Schema, model } from 'mongoose'

const myPropertySchema = Schema(
	{
		userID: {
			type: String,
			required: true,
		},
		property: {
			type: Schema.Types.ObjectId,
			ref: 'property',
		},
	},
	{
		timestamps: true,
		statics: {
			async removeProperty(propertyID) {
				this.findOneAndDelete({ property: propertyID }).exec()
			},
		},
	},
)
export default model('myProperty', myPropertySchema)
