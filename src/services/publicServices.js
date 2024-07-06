import myPropertyModel from '../models/myPropertyModel.js'

const getPropertiesByUserID = async (req, res) => {
	const { userID } = req.params
	try {
		const result = await myPropertyModel.getPropertiesByUserID(userID)
		const mess = []
		const hostel = []
		const sublet = []

		result.forEach((property) => {
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
		res.status(500).json({
			message: 'Failed to retrieve properties',
		})
	}
}

export default getPropertiesByUserID
