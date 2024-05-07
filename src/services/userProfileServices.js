import UserModel from '../models/userModel.js'
import notificationModel from '../models/notificationModel.js'

const getUserInfo = async (req, res) => {
	const { userID } = req.user
	try {
		const user = await UserModel.getUserInfo(userID)
		res.status(200).json({
			message: 'User info retrieved successfully',
			data: user,
		})
	} catch (err) {
		res.status(500).json({
			message: 'Error retrieving user info',
		})
	}
}
const getUserInfoWithID = async (req, res) => {
	const { userID } = req.params
	try {
		const user = await UserModel.getUserInfo(userID)
		res.status(200).json({
			message: 'User info retrieved successfully',
			data: user,
		})
	} catch (err) {
		res.status(500).json({
			message: 'Error retrieving user info',
		})
	}
}
const updateUserName = async (req, res) => {
	const { name } = req.body
	const { userID } = req.user
	try {
		await UserModel.updateUserName(userID, name)
		res.status(200).json({
			message: 'Updated user name successfully',
		})
	} catch (err) {
		res.status(500).json({
			message: 'Failed to update user name',
		})
	}
}
const getNotifications = async (req, res) => {
	const { userID } = req.user
	try {
		const notifications = await notificationModel.getNotifications(userID)
		res.status(200).json({
			message: 'Successfully retrieved notifications',
			data: notifications,
		})
	} catch (err) {
		res.status(500).json({
			message: 'Failed to get notifications',
		})
	}
}
const getNotificationsWithID = async (req, res) => {
	const { userID } = req.params
	try {
		const notifications = await notificationModel.getNotifications(userID)
		res.status(200).json({
			message: 'Successfully retrieved notifications',
			data: notifications,
		})
	} catch (err) {
		res.status(500).json({
			message: 'Failed to get notifications',
		})
	}
}
export { getUserInfo, updateUserName, getNotifications, getUserInfoWithID, getNotificationsWithID }
