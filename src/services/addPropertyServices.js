import AddPropertyModel from '../models/addPropertyModel.js'
import getNanoID from '../utils/uniqueIdGenerator.js'

const getProperty = async (req, res) => {
	const data = await AddPropertyModel.find()
	res.json({
		data,
	})
}
const addProperty = async (req, res) => {
	try {
		const propertyID = getNanoID(22)
		console.log(propertyID)
		const data = req.body
		const newProperty = new AddPropertyModel({
			ID: propertyID,
			title: data.title,
			availableDate: data.availableDate,
			gender: data.gender,
			category: data.category,
			description: data.description,
			rulesAndPreference: data.rulesAndPreference,
			requiredDocuments: data.requiredDocuments,
			placeInfo: {
				division: data.division,
				district: data.district,
				thana: data.thana,
			},
			price: data.price,
			address: data.address,
			mapCoordinate: data.mapCoordinate,
		})
		await newProperty.save()
		res.end('Success')
	} catch (err) {
		console.log(err.message)
		res.end('Error')
	}
}
export { addProperty, getProperty }
