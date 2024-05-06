import MyPropertyModel from '../models/myPropertyModel.js'
import PropertyModel from '../models/propertyModel.js'
import notificationModel from '../models/notificationModel.js'

const getProperties = async (req, res) => {
	const { userID } = req.user
	try {
		const properties = await MyPropertyModel.find(
			{ userID },
			{ _id: 0, __v: 0, createdAt: 0, updatedAt: 0 },
		)
			.populate('property')
			.exec()
		res.json({
			data: properties,
		})
	} catch (err) {
		res.status(400).json({
			message: err.message,
		})
	}
}
const editProperty = async (req, res) => {
	const { info, ID } = req.body
	const { userID } = req.user
	await PropertyModel.updatePropertyByID(ID, info)
	await notificationModel.addNotification(userID, ID, `Successfully updated property no ${ID}`)
	res.json({
		message: 'Successfully edited property',
	})
}
const updateStatus = async (req, res) => {
	const { status, ID } = req.body
	const { userID } = req.user
	await PropertyModel.updateStatus(ID, status)
	await notificationModel.addNotification(
		userID,
		ID,
		`Successfully updated status of property no ${ID} to ${status ? 'active' : 'inactive'}`,
	)
	res.json({
		message: 'Status updated successfully',
	})
}
const removeProperty = async (req, res) => {
	const { propertyID } = req.params
	const { userID } = req.user
	const property = await PropertyModel.findOneAndDelete({ ID: propertyID })
	await MyPropertyModel.removeProperty(property.id)
	await notificationModel.addNotification(
		userID,
		propertyID,
		`Successfully removed property no ${propertyID}`,
	)
	res.json({
		message: 'Successfully removed property',
	})
}
export { getProperties, editProperty, removeProperty, updateStatus }
