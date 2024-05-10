import { Schema, model } from 'mongoose'

const myFavoriteSchema = new Schema(
	{
		userID: {
			type: String,
			required: true,
		},
		properties: [
			{
				property: {
					type: Schema.Types.ObjectId,
					ref: 'property',
				},
			},
		],
	},
	{
		timestamps: true,
		statics: {
			async addFavorite(userID, propertyID) {
				let user = await this.findOne({ userID }).populate('properties.property').exec()
				if (!user) {
					user = new this({ userID, properties: [] })
				}
				const found = user.properties.find((property) => property.property.id === propertyID)
				if (found) return
				user.properties.push({
					property: propertyID,
				})
				await user.save()
			},
			async getFavorites(userID) {
				const user = await this.findOne({ userID }, { _id: 0 })
				if (!user) return []
				const properties = await user.populate({
					path: 'properties.property',
					select: '-_id -__v -createdAt -updatedAt',
				})
				if (!properties?.properties) return []
				return properties.properties
			},
		},
	},
)

export default model('myFavorite', myFavoriteSchema)
