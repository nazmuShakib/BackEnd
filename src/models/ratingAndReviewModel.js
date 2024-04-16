import { Schema, model } from 'mongoose'

const ReviewSchema = Schema({
	userID: {
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
			async postReview(propertyID, review, userID) {
				const ratingReview = await this.findOne({ propertyID })
				await ratingReview.reviews.push({
					userID,
					review,
				})
				await ratingReview.save()
			},
		},
	},
)
export default model('ratingReviewSchema', RatingReviewSchema)
