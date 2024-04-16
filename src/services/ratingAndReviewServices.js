import RatingAndReviewModel from '../models/ratingAndReviewModel.js'

const postReview = async (req, res) => {
	const { userID, name } = req.user
	const { propertyID, review } = req.body
	try {
		await RatingAndReviewModel.postReview(propertyID, name, review, userID)
		res.json({
			message: 'Successfully posted a review',
		})
	} catch (err) {
		res.status(500).json({
			message: 'Failed to post a review',
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
export { postReview, getReviews }
