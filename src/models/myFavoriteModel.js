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
					match: { active: true },
					select: '-_id -__v -createdAt -updatedAt -bkash',
				})
				if (!properties?.properties) return []
				const result = properties.properties.filter((property) => property.property !== null)
				return result
			},
			async removeFavorite(userID, propertyID) {
				const user = await this.findOne({ userID })
				if (!user) throw new Error('User not found')
				const newFavorites = []
				user.properties.forEach((favorite) => {
					if (favorite.property.toString() !== propertyID) {
						newFavorites.push(favorite)
					}
				})
				user.properties = newFavorites
				await user.save()
			},
		},
	},
)

export default model('myFavorite', myFavoriteSchema)
