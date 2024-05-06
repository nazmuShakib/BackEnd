import { Schema, model } from 'mongoose'

const propertySchema = new Schema(
	{
		propertyID: {
			type: String,
			required: true,
		},
		notification: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true },
)
const notificationSchema = new Schema(
	{
		userID: {
			type: String,
			required: true,
		},
		notifications: [
			{
				type: propertySchema,
			},
		],
	},
	{
		timestamps: true,
		statics: {
			async addNotification(userID, propertyID, notification) {
				let userNotification = await this.findOne({ userID })
				if (!userNotification) {
					userNotification = new this({ userID, notifications: [] })
				}
				userNotification.notifications.push({
					propertyID,
					notification,
				})
				await userNotification.save()
			},
			async getNotifications(userID) {
				const { notifications } = await this.findOne({ userID })
				notifications.sort((a, b) => b.createdAt - a.createdAt)
				return notifications
			},
		},
	},
)

export default model('notification', notificationSchema)
