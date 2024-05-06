import RatingAndReviewModel from '../models/ratingAndReviewModel.js'
import notificationModel from '../models/notificationModel.js'

const postReview = async (req, res) => {
	const { userID } = req.user
	const { propertyID, review, postTime } = req.body
	try {
		await RatingAndReviewModel.postReview(propertyID, review, postTime, userID)
		await notificationModel.addNotification(
			userID,
			propertyID,
			`Successfully reviewed about property no ${propertyID}`,
		)
		res.status(200).json({
			message: 'Successfully posted a review',
		})
	} catch (err) {
		res.status(500).json({
			message: 'Failed to post a review',
		})
	}
}
const postRating = async (req, res) => {
	const { userID } = req.user
	const { propertyID, rating } = req.body
	try {
		await RatingAndReviewModel.postRating(propertyID, rating, userID)
		res.status(200).json({
			message: 'Rating updated successfully',
		})
	} catch (err) {
		res.status(500).json({
			message: 'Failed to post rating',
		})
	}
}
const getReviews = async (req, res) => {
	const { propertyID } = req.params
	try {
		const reviews = await RatingAndReviewModel.getReviews(propertyID)
		res.json({
			message: 'Successfully retrieved reviews',
			data: reviews,
		})
	} catch (err) {
		res.status(500).json({
			message: 'Failed to retrieve reviews',
		})
	}
}
const getRating = async (req, res) => {
	const { propertyID } = req.params
	const { userID } = req.user
	try {
		const rating = await RatingAndReviewModel.getRating(propertyID, userID)
		res.status(200).json({
			message: 'Successfully retrieved rating',
			data: rating,
		})
	} catch (err) {
		res.status(500).json({
			message: 'Failed to retrieve rating',
		})
	}
}
const getRatings = async (req, res) => {
	const { propertyID } = req.params
	try {
		const ratings = await RatingAndReviewModel.getRatings(propertyID)
		res.status(200).json({
			message: 'Successfully retrieved ratings',
			data: ratings,
		})
	} catch (err) {
		res.status(500).json({
			message: 'Failed to retrieve ratings',
		})
	}
}
export { postReview, postRating, getReviews, getRating, getRatings }
