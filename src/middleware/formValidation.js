import { z } from 'zod'

const MAX_FILE_SIZE = 5000000
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const PropertySchema = z.object({
	title: z
		.string()
		.max(100, 'max 100 characters')
		.refine((data) => {
			const actualData = data.trimEnd().trimStart()
			return actualData !== ''
		}, 'Required'),

	date: z.string().refine((value) => {
		const dif = Math.ceil((new Date(value) - Date.now()) / (1000 * 60 * 60 * 24))
		return dif <= 365 && dif >= 0
	}, 'Select a day between today and the next 365 days'),

	gender: z.string().min(1, 'Select a gender'),

	division: z.string().refine((data) => data !== '', {
		message: 'Select a Division',
	}),

	district: z.string().refine((data) => data !== '', {
		message: 'Select a District',
	}),

	thana: z.string().refine((data) => data !== '', {
		message: 'Select a Thana',
	}),

	category: z.string().min(1, 'Select a category'),

	description: z
		.string()
		.max(500, 'max 500 characters')
		.refine(
			(data) => {
				const actualData = data.trimEnd().trimStart()
				return actualData !== ''
			},
			{ message: 'Required' },
		),

	rules_and_preference: z.string().max(500, 'max 500 characters').optional('Optional'),

	required_documents: z.string().max(500, 'You can use at most 10 characters').optional(),

	price: z
		.string()
		.refine((data) => data !== '', {
			message: 'Required',
		})
		.refine((data) => parseInt(data, 10) >= 0, {
			message: 'Price must be a positive number',
		})
		.refine((data) => parseInt(data, 10) <= 1000000007, {
			message: 'Price must be less than 1000000007',
		}),

	contact: z.string().refine((data) => data !== '', {
		message: 'Required',
	}),

	address: z
		.string()
		.max(100, 'max 100 characters')
		.refine(
			(data) => {
				const actualData = data.trimEnd().trimStart()
				return actualData !== ''
			},
			{ message: 'Required' },
		),

	location: z.any().refine((obj) => obj !== undefined, 'Select location of your property'),
})
const imageSchema = z.object({
	images: z
		.any()
		.refine((files) => files?.length > 0, 'Image is required')
		.refine((files) => {
			const res = files?.map((file) => file.size <= MAX_FILE_SIZE)
			return !res.includes(false)
		}, 'Max image size is 5MB.')
		.refine((files) => {
			const res = files?.map((file) => ACCEPTED_IMAGE_TYPES.includes(file.mimetype))
			return !res.includes(false)
		}, 'Only .jpg, .jpeg, .png and .webp formats are supported.'),
})

const formValidator = (req, res, next) => {
	try {
		const { data } = req.body
		const images = req.files
		const parsedData = JSON.parse(data)
		PropertySchema.parse(parsedData)
		imageSchema.parse({ images })
		next()
	} catch (err) {
		next(err)
	}
}
export default formValidator
