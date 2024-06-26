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

		const mess = []
		const hostel = []
		const sublet = []

		properties.forEach((property) => {
			if (property.property.category === 'Mess') mess.push(property.property)
			else if (property.property.category === 'Hostel') hostel.push(property.property)
			else if (property.property.category === 'Sublet') sublet.push(property.property)
		})

		const all = {
			mess,
			hostel,
			sublet,
		}

		res.json({
			data: all,
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
	await PropertyModel.updatePropertyByID(ID, userID, info)
	await notificationModel.addNotification(userID, ID, `Successfully updated property no ${ID}`)
	res.json({
		message: 'Successfully edited property',
	})
}
const updateStatus = async (req, res) => {
	const { status, ID } = req.body
	const { userID } = req.user
	await PropertyModel.updateStatus(ID, userID, status)
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
	const property = await PropertyModel.findOneAndDelete({ ID: propertyID, userID })
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
