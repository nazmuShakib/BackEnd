import PropertyModel from '../models/propertyModel.js'
import MyPropertyModel from '../models/myPropertyModel.js'
import notificationModel from '../models/notificationModel.js'
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
		const { userID } = req.user
		const images = req.files
		const imageNames = images.map((name) => name.originalname)
		await Promise.all(images.map((image) => uploadImageToStorage(image, propertyID)))
		await uploadThumbnail(images[0], propertyID)
		const thumbnail = getThumbnailURL(propertyID)
		const propertyData = {
			...JSON.parse(data),
			images: imageNames,
		}
		const imageUrls = getImageUrls(images, propertyID)
		const newProperty = new PropertyModel({
			ID: propertyID,
			userID,
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
			price: parseInt(propertyData.price, 10),
			address: propertyData.address,
			contact: propertyData.contact,
			optionalContact: propertyData.optional_contact,
			bkash: propertyData.bkash,
			images: propertyData.images,
			location: {
				type: 'Point',
				coordinates: [propertyData.location.lng, propertyData.location.lat],
			},
			imageUrls,
			thumbnail,
		})
		const property = await newProperty.save()
		const myProperty = new MyPropertyModel({
			userID: req.user.userID,
			property: property.id,
		})
		await myProperty.save()
		await notificationModel.addNotification(
			userID,
			propertyID,
			`Successfully created property no ${propertyID}`,
		)
		res.json({
			message: 'Successfully created property',
		})
	} catch (err) {
		console.log(err.message)
		res.status(400).json({
			message: err.message,
		})
	}
}
export default addProperty
