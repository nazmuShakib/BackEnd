import AddPropertyModel from '../models/addPropertyModel.js'
import getNanoID from '../utils/uniqueIdGenerator.js'
import containerClient from '../utils/connectBlobDB.js'

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
		const { data } = req.body
		const images = req.files
		const imageNames = images.map((image) => image.originalname)
		const propertyData = {
			...JSON.parse(data),
			images: imageNames,
		}
		console.log(propertyData)
		const newProperty = new AddPropertyModel({
			ID: propertyID,
			title: propertyData.title,
			availableDate: propertyData.date,
			gender: propertyData.gender,
			category: propertyData.category,
			description: propertyData.description,
			rulesAndPreference: propertyData.rules_and_preference,
			requiredDocuments: propertyData.required_documents,
			placeInfo: {
				division: propertyData.division,
				district: propertyData.district,
				thana: propertyData.thana,
			},
			price: propertyData.price,
			address: propertyData.address,
			images: propertyData.images,
			mapCoordinate: propertyData.location,
		})
		await newProperty.save()
		res.end('Success')
	} catch (err) {
		console.log(err.message)
		res.end('Error')
	}
}
export { addProperty, getProperty }
