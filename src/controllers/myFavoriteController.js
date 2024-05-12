import express from 'express'
import { verifyUser } from '../middleware/userAuthentication.js'
import { addToFavorite, getFavorites, removeFavorite } from '../services/myFavoriteServices.js'

const router = express.Router()

router.use(verifyUser)
router.route('/add').post(addToFavorite)
router.route('/get').get(getFavorites)
router.route('/remove/:propertyID').delete(removeFavorite)

export default router
