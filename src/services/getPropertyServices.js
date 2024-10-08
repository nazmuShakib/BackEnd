import PropertyModel from '../models/propertyModel.js'

const getPropertyByID = async (req, res) => {
	try {
		const id = req.params.propertyID
		const property = await PropertyModel.findOne(
			{ ID: id, active: true },
			{ _id: 0, __v: 0, createdAt: 0, updatedAt: 0, bkash: 0 },
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
		const result = await PropertyModel.find(
			{ active: true },
			{ _id: 0, __v: 0, createdAt: 0, updatedAt: 0, bkash: 0 },
		).limit(300)
		const mess = result.filter((property) => property.category === 'Mess')
		const hostel = result.filter((property) => property.category === 'Hostel')
		const sublet = result.filter((property) => property.category === 'Sublet')
		const all = {
			mess,
			hostel,
			sublet,
		}
		res.json({ data: all })
	} catch (err) {
		res.json({
			message: err.message,
		})
	}
}
export { getProperty, getPropertyByID }
