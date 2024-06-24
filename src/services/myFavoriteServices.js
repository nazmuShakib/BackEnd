import myFavoriteModel from '../models/myFavoriteModel.js'
import propertyModel from '../models/propertyModel.js'

const addToFavorite = async (req, res) => {
	const { userID } = req.user
	const { propertyID } = req.body
	try {
		const property = await propertyModel.findOne({ ID: propertyID })
		await myFavoriteModel.addFavorite(userID, property.id)
		res.status(200).json({ message: 'Added to favorite' })
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}
const getFavorites = async (req, res) => {
	const { userID } = req.user
	try {
		const favorites = await myFavoriteModel.getFavorites(userID)
		res.status(200).json({
			message: 'Successfully fetched favorites',
			data: favorites,
		})
	} catch (err) {
		res.status(500).json({
			message: err.message,
		})
	}
}
const removeFavorite = async (req, res) => {
	const { propertyID } = req.params
	const { userID } = req.user
	try {
		const property = await propertyModel.findOne({ ID: propertyID, active: true })
		if (!property) {
			res.status(404).json({
				message: 'Property not found',
			})
		} else {
			await myFavoriteModel.removeFavorite(userID, property.id)
			res.status(200).json({
				message: 'Successfully removed favorite',
			})
		}
	} catch (err) {
		res.status(500).json({
			message: err.message,
		})
	}
}
export { addToFavorite, getFavorites, removeFavorite }
