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
			async getPropertiesByUserID(userID) {
				const properties = await this.find(
					{ userID },
					{ _id: 0, __v: 0, createdAt: 0, updatedAt: 0 },
				)
					.select('-_id -__v -createdAt -updatedAt')
					.populate({ path: 'property', select: '-_id -__v -createdAt -updatedAt -bkash' })
					.exec()
				return properties
			},
			async hasProperty(userID, propertyID) {
				const properties = await this.getPropertiesByUserID(userID)
				const has = properties.find((property) => property.property.ID === propertyID)
				if (has) return true
				return false
			},
		},
	},
)
export default model('myProperty', myPropertySchema)
