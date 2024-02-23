import AddPropertyModel from '../models/addPropertyModel.js'

const getPropertyByID = async (req, res) => {
	try {
		const id = req.params.propertyID
		const property = await AddPropertyModel.findOne(
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
const getProperty = async (req, res) => {
	try {
		const data = await AddPropertyModel.find()
		res.json({ data })
	} catch (err) {
		res.json({
			message: err.message,
		})
	}
}
export { getProperty, getPropertyByID }
