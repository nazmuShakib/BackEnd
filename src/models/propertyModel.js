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
			enum: ['male', 'female'],
			required: true,
		},
		category: {
			type: String,
			enum: ['sublet', 'hostel', 'mess'],
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
			type: String,
			required: true,
		},
		address: {
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
	{ timestamps: true },
)
PropertySchema.index({ location: '2dsphere' })

export default model('property', PropertySchema)
