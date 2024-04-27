import express from 'express'
import { verifyUser } from '../middleware/userAuthentication.js'
import {
	postReview,
	getReviews,
	postRating,
	getRating,
	getRatings,
} from '../services/ratingAndReviewServices.js'

const reviewRouter = express.Router()
const ratingRouter = express.Router()
const publicRatingReviewRouter = express.Router()

ratingRouter.use(verifyUser)
reviewRouter.use(verifyUser)

reviewRouter.route('/post').post(postReview)

ratingRouter.route('/post').post(postRating)
ratingRouter.route('/get/:propertyID').get(getRating)

publicRatingReviewRouter.route('/reviews/:propertyID').get(getReviews)
publicRatingReviewRouter.route('/ratings/:propertyID').get(getRatings)

export { reviewRouter, ratingRouter, publicRatingReviewRouter }
