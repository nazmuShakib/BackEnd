import PropertyModel from '../models/propertyModel.js'
import MyPropertyModel from '../models/myPropertyModel.js'

const getPropertyByID = async (req, res) => {
	try {
		const id = req.params.propertyID
		const property = await PropertyModel.findOne(
			{ ID: id },
			{ _id: 0, __v: 0, createdAt: 0, updatedAt: 0 },
		)
		res.json({
			data: property,
		})
	} catch (err) {
		res.status(400).json({
			message: err.message,
		})
	}
}
const getMyProperties = async (req, res) => {
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
const getProperty = async (req, res) => {
	try {
		const data = await PropertyModel.find()
		res.json({ data })
	} catch (err) {
		res.json({
			message: err.message,
		})
	}
}
export { getProperty, getPropertyByID, getMyProperties }
