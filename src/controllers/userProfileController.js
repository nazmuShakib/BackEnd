import express from 'express'
import {
	getUserInfo,
	getUserInfoWithID,
	updateUserName,
	getNotifications,
	getNotificationsWithID,
} from '../services/userProfileServices.js'
import { verifyUser } from '../middleware/userAuthentication.js'

const authUserRouter = express.Router({ strict: true })
const publicUserRouter = express.Router({ strict: true })

authUserRouter.use(verifyUser)
authUserRouter.route('/get-info').get(getUserInfo)
authUserRouter.route('/edit/name').patch(updateUserName)
authUserRouter.route('/notifications').get(getNotifications)

publicUserRouter.route('/get-info/:userID').get(getUserInfoWithID)
publicUserRouter.route('/notifications/:userID').get(getNotificationsWithID)

export { authUserRouter, publicUserRouter }
