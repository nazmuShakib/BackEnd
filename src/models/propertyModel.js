import { Schema, model } from 'mongoose'

const PlaceSchema = new Schema({
	division: {
		type: String,
		required: true,
	},
	district: {
		type: String,
		required: true,
	},
	thana: {
		type: String,
		required: true,
	},
})

const PropertySchema = new Schema(
	{
		ID: {
			type: String,
			required: true,
		},
		userID: {
			type: String,
			required: true,
		},
		active: {
			type: Boolean,
			default: true,
		},
		title: {
			type: String,
			required: true,
		},
		availableDate: {
			type: String,
			required: true,
		},
		gender: {
			type: String,
			enum: ['Male', 'Female'],
			required: true,
		},
		category: {
			type: String,
			enum: ['Sublet', 'Hostel', 'Mess'],
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		rulesAndPreference: {
			type: String,
		},
		requiredDocuments: {
			type: String,
		},
		placeInfo: PlaceSchema,
		price: {
			type: Number,
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
		contact: {
			type: String,
			required: true,
		},
		optionalContact: {
			type: String,
			default: '',
		},
		bkash: {
			type: String,
			required: true,
		},
		thumbnail: {
			type: String,
			required: true,
		},
		images: {
			type: Array,
			required: true,
		},
		imageUrls: {
			type: Array,
			required: true,
		},
		location: {
			type: {
				type: String,
				enum: ['Point'],
				required: true,
			},
			coordinates: {
				type: [Number],
				required: true,
			},
		},
	},
	{
		timestamps: true,
		statics: {
			async updatePropertyByID(propertyID, userID, newData) {
				await this.findOneAndUpdate(
					{ ID: propertyID, userID },
					{
						$set: {
							ID: propertyID,
							title: newData.title,
							availableDate: newData.date,
							description: newData.description,
							rulesAndPreference: newData?.rules_and_preference,
							requiredDocuments: newData?.required_documents,
							price: parseInt(newData.price, 10),
							address: newData.address,
							contact: newData.contact,
						},
					},
					{
						returnDocument: 'after',
					},
				).exec()
			},
			async updateStatus(propertyID, userID, status) {
				await this.findOneAndUpdate(
					{ ID: propertyID, userID },
					{
						$set: {
							active: status,
						},
					},
					{ returnDocument: 'after' },
				).exec()
			},
			async getPropertyTransactionInfo(propertyID, userID) {
				console.log(propertyID)
				console.log(userID)
				const { title, price, placeInfo, bkash } = await this.findOne({ ID: propertyID, userID })
				const data = {
					bkash,
					title,
					price,
					placeInfo,
				}
				return data
			},
		},
	},
)
PropertySchema.index({ location: '2dsphere' })
PropertySchema.index({ price: 'ascending' })

export default model('property', PropertySchema)
