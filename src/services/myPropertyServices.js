import MyPropertyModel from '../models/myPropertyModel.js'
import PropertyModel from '../models/propertyModel.js'

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
const removeProperty = async (req, res) => {
	const { propertyID } = req.params
	const property = await PropertyModel.findOneAndDelete({ ID: propertyID })
	await MyPropertyModel.removeProperty(property.id)
	res.json({
		message: 'Successfully removed property',
	})
}
export { getProperties, removeProperty }
