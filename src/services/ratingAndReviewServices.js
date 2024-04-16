import RatingAndReviewModel from '../models/ratingAndReviewModel.js'

const postReview = async (req, res) => {
	const { userID } = req.user
	const { propertyID, review } = req.body
	try {
		await RatingAndReviewModel.postReview(propertyID, review, userID)
		res.json({
			message: 'Successfully posted a review',
		})
	} catch (err) {
		res.status(500).json({
			message: 'Failed to post a review',
		})
	}
}
export default postReview
