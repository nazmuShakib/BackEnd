import myPropertyModel from '../models/myPropertyModel.js'

const getPropertiesByUserID = async (req, res) => {
	const { userID } = req.params
	try {
		const properties = await myPropertyModel.getPropertiesByUserID(userID)
		res.status(200).json({
			message: 'Successfully retrieved properties',
			data: properties,
		})
	} catch (err) {
		res.status(500).json({
			message: 'Failed to retrieve properties',
		})
	}
}

export default getPropertiesByUserID
