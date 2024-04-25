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

ratingRouter.use(verifyUser)
reviewRouter.use(verifyUser)

reviewRouter.route('/post').post(postReview)
reviewRouter.route('/get/:propertyID').get(getReviews)
ratingRouter.route('/post').post(postRating)
ratingRouter.route('/get/:propertyID').get(getRating)
ratingRouter.route('/get/all/:propertyID').get(getRatings)

export { reviewRouter, ratingRouter }
