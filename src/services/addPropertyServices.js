import AddPropertyModel from '../models/addPropertyModel.js'
import { getNanoID } from '../utils/uniqueIdGenerator.js'
import uploadImageToStorage from '../utils/AzureBlobDB.js'

const addProperty = async (req, res) => {
	try {
		const propertyID = getNanoID(22)
		const { data } = req.body
		const images = req.files
		const imageNames = images.map((name) => name.originalname)
		await Promise.all(images.map((image) => uploadImageToStorage(image, propertyID)))
		const propertyData = {
			...JSON.parse(data),
			images: imageNames,
		}
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
		res.status(200).end('Property saved successfully')
	} catch (err) {
		console.log(err.message)
		res.json({
			message: err.message,
		})
	}
}
export default addProperty
