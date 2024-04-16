import { Schema, model } from 'mongoose'

const ReviewSchema = Schema({
	userID: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	review: {
		type: String,
		required: true,
	},
})
const RatingReviewSchema = Schema(
	{
		propertyID: {
			type: String,
			required: true,
		},
		reviews: [
			{
				type: ReviewSchema,
			},
		],
	},
	{
		timestamps: true,
		statics: {
			async postReview(propertyID, name, review, userID) {
				let ratingReview = await this.findOne({ propertyID })
				if (!ratingReview) {
					ratingReview = new this({ propertyID, reviews: [] })
				}
				await ratingReview.reviews.push({
					userID,
					name,
					review,
				})
				await ratingReview.save()
			},
		},
	},
)
export default model('ratingReviewSchema', RatingReviewSchema)
