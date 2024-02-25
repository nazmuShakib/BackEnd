import PropertyModel from '../models/propertyModel.js'
import { getNanoID } from '../utils/uniqueIdGenerator.js'
import {
	getImageUrls,
	getThumbnailURL,
	uploadImageToStorage,
	uploadThumbnail,
} from '../utils/AzureBlobDB.js'

const addProperty = async (req, res) => {
	try {
		const propertyID = getNanoID(22)
		const { data } = req.body
		const images = req.files
		const imageNames = images.map((name) => name.originalname)
		// await Promise.all(images.map((image) => uploadImageToStorage(image, propertyID)))
		// await uploadThumbnail(images[0], propertyID)
		const thumbnail = getThumbnailURL(propertyID)
		const propertyData = {
			...JSON.parse(data),
			images: imageNames,
		}
		const imageUrls = getImageUrls(images, propertyID)
		const newProperty = new PropertyModel({
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
			location: {
				type: 'Point',
				coordinates: [propertyData.location.lng, propertyData.location.lat],
			},
			imageUrls,
			thumbnail,
		})
		await newProperty.save()
		res.status(200).end('Property saved successfully')
	} catch (err) {
		console.log(err.message)
		res.status(400).json({
			message: err.message,
		})
	}
}
export default addProperty
