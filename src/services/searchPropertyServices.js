import PropertyModel from '../models/propertyModel.js'
import {
	DEFAULT_SEARCH_CATEGORY,
	DEFAULT_SEARCH_LOCATION,
	DEFAULT_SEARCH_PRICE_RANGE,
	DEFAULT_MAX_PROPERTY_SEARCH_DISTANCE,
} from '../config/defaultValues.js'

const searchProperty = async (req, res) => {
	try {
		const data = req.body
		const { location, category, priceRange } = data
		const propertyLocation = location || DEFAULT_SEARCH_LOCATION
		const propertyCategory = category || DEFAULT_SEARCH_CATEGORY
		const propertyPriceRange = priceRange || DEFAULT_SEARCH_PRICE_RANGE
		const query = {
			active: true,
			location: {
				$near: {
					$geometry: {
						type: 'Point',
						coordinates: [propertyLocation.lng, propertyLocation.lat],
					},
					$maxDistance: DEFAULT_MAX_PROPERTY_SEARCH_DISTANCE,
				},
			},
		}
		query.price = {
			$gte: propertyPriceRange[0],
		}
		if (propertyPriceRange[1] !== DEFAULT_SEARCH_PRICE_RANGE[1]) {
			query.price = { ...query.price, $lte: propertyPriceRange[1] }
		}
		if (!propertyCategory.includes('Any')) query.category = { $in: propertyCategory }
		const result = await PropertyModel.find(query, {
			_id: 0,
			__v: 0,
			createdAt: 0,
			updatedAt: 0,
			bkash: 0,
		}).limit(150)
		const mess = result.filter((property) => property.category === 'Mess')
		const hostel = result.filter((property) => property.category === 'Hostel')
		const sublet = result.filter((property) => property.category === 'Sublet')
		const all = {
			mess,
			hostel,
			sublet,
		}
		res.json({
			data: all,
		})
	} catch (err) {
		res.status(400).json({
			message: err.message,
		})
	}
}

export default searchProperty
