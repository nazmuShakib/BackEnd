import express from 'express'
import { getUserInfo, updateUserName, getNotifications } from '../services/userProfileServices.js'
import { verifyUser } from '../middleware/userAuthentication.js'

const router = express.Router()

router.use(verifyUser)
router.route('/get-info').get(getUserInfo)
router.route('/edit/name').patch(updateUserName)
router.route('/notifications').get(getNotifications)
export default router
