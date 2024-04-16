import express from 'express'
import { verifyUser } from '../middleware/userAuthentication.js'
import { postReview, getReviews } from '../services/ratingAndReviewServices.js'

const router = express.Router()

router.use(verifyUser)

router.route('/post').post(postReview)
router.route('/get/:propertyID').get(getReviews)

export default router
