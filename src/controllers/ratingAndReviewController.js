import express from 'express'
import { verifyUser } from '../middleware/userAuthentication.js'
import postReview from '../services/ratingAndReviewServices.js'

const router = express.Router()

router.use(verifyUser)

router.route('/post').post(postReview)

export default router
