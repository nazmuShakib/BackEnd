import { Schema, model } from 'mongoose'
import userModel from './userModel.js'

const ReviewSchema = Schema({
	userID: {
		type: String,
		required: true,
	},
	name: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: true,
	},
	review: {
		type: String,
		required: true,
	},
	postTime: {
		type: Date,
		required: true,
	},
})
const RatingSchema = Schema({
	userID: {
		type: String,
		required: true,
	},
	rating: {
		type: Number,
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
		ratings: [
			{
				type: RatingSchema,
			},
		],
	},
	{
		timestamps: true,
		statics: {
			async postReview(propertyID, review, postTime, userID) {
				let property = await this.findOne({ propertyID })
				const user = await userModel.findOne({ userID })
				if (!property) {
					property = new this({ propertyID, reviews: [], ratings: [] })
				}
				await property.reviews.push({
					userID,
					name: user.id,
					review,
					postTime,
				})
				await property.save()
			},
			async postRating(propertyID, rating, userID) {
				let property = await this.findOne({ propertyID })
				if (!property) {
					property = new this({ propertyID, ratings: [], reviews: [] })
				}
				const existingRating = await property.ratings.find((user) => user.userID === userID)
				if (rating === null && existingRating) {
					property.ratings = await property.ratings.filter((item) => item !== existingRating)
				} else if (existingRating) {
					existingRating.rating = rating
				} else {
					await property.ratings.push({
						userID,
						rating,
					})
				}
				await property.save()
			},
			async getReviews(propertyID) {
				const property = await this.findOne({ propertyID }).populate('reviews.name')
				if (!property?.reviews) return []
				const populatedReviews = property.reviews.map((review) => ({
					...review.toObject(),
					name: review.name.username,
				}))
				return populatedReviews
			},
			async getRating(propertyID, userID) {
				const property = await this.findOne({ propertyID })
				if (!property) return 0
				const existingRating = await property.ratings.find((user) => user.userID === userID)
				if (!existingRating) return 0
				return existingRating.rating
			},
			async getRatings(propertyID) {
				const property = await this.findOne({ propertyID })
				const count = new Array(6)
				for (let i = 0; i <= 5; i += 1) count[i] = 0
				if (property) {
					await property.ratings.forEach((user) => {
						count[user.rating] += 1
					})
				}
				return count
			},
		},
	},
)
export default model('ratingReviewSchema', RatingReviewSchema)
