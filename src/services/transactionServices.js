import SSLCommerzPayment from 'sslcommerz-lts'
import transactionModel from '../models/transactionModel.js'
import propertyModel from '../models/propertyModel.js'
import myPropertyModel from '../models/myPropertyModel.js'
import notificationModel from '../models/notificationModel.js'
import { getNanoID } from '../utils/uniqueIdGenerator.js'

const makePayment = async (req, res) => {
	const { propertyID } = req.body
	const { userID } = req.user
	try {
		const hasProperty = await myPropertyModel.hasProperty(userID, propertyID)
		console.log(hasProperty)
		if (hasProperty) throw new Error('Cannot rent personal property')
		const info = await propertyModel.getPropertyTransactionInfo(propertyID)
		const transactionID = getNanoID(30)
		const data = {
			total_amount: info.price,
			currency: 'BDT',
			tran_id: transactionID,
			success_url: `http://localhost:3000/public/payment/success/${transactionID}/${userID}?propertyID=${propertyID}`,
			fail_url: `http://localhost:3000/public/payment/fail/${transactionID}/${userID}?propertyID=${propertyID}`,
			cancel_url: `http://localhost:3000/public/payment/fail/${transactionID}/${userID}?propertyID=${propertyID}`,
			ipn_url: `http://localhost:3000/public/payment/ipn/${transactionID}/${userID}?propertyID=${propertyID}`,
			shipping_method: 'Courier',
			product_name: info.title,
			product_category: 'Electronic',
			product_profile: 'general',
			cus_name: 'Customer Name',
			cus_email: 'customer@example.com',
			cus_add1: 'Dhaka',
			cus_add2: 'Dhaka',
			cus_city: info.district,
			cus_state: info.division,
			cus_postcode: '1000',
			cus_country: 'Bangladesh',
			cus_phone: '01711111111',
			cus_fax: '01711111111',
			ship_name: 'Customer Name',
			ship_add1: 'Dhaka',
			ship_add2: 'Dhaka',
			ship_city: 'Dhaka',
			ship_state: 'Dhaka',
			ship_postcode: 1000,
			ship_country: 'Bangladesh',
		}
		const storeID = process.env.STORE_ID
		const storePassword = process.env.STORE_PASSWORD
		const isLive = false
		const sslcz = new SSLCommerzPayment(storeID, storePassword, isLive)
		const { GatewayPageURL, gw, redirectGatewayURL, desc } = await sslcz.init(data)
		// const bkashGateway = desc.find((item) => item.gw === 'bkash')
		await transactionModel.createTransaction(userID, propertyID, transactionID)
		res.json({
			message: `Redirect to ${GatewayPageURL}`,
			url: GatewayPageURL,
		})
	} catch (err) {
		res.status(400).json({
			message: 'Could not create transaction',
		})
	}
}
const successfulPayment = async (req, res) => {
	const { transactionID, userID } = req.params
	const { propertyID } = req.query
	try {
		if (!propertyID) throw new Error('No property found')
		await transactionModel.successfulTransaction(userID, transactionID)
		res.redirect(`${process.env.PAYMENT_SUCCESS_URL}?propertyID=${propertyID}`)
		await propertyModel.updateStatus(propertyID, false)
		await notificationModel.addNotification(
			userID,
			propertyID,
			`Successful payment of property ${propertyID}`,
		)
	} catch (err) {
		res.redirect(`${process.env.PAYMENT_FAILURE_URL}?propertyID=${propertyID}`)
	}
}
const failedPayment = async (req, res) => {
	console.log('failed payment')
	const { propertyID } = req.query
	try {
		const { transactionID, userID } = req.params

		await transactionModel.failTransaction(userID, transactionID)
	} catch (err) {
		console.log(err)
	}
	res.redirect(`${process.env.PAYMENT_FAILURE_URL}?propertyID=${propertyID}`)
}
const ipnPayment = async (req, res) => {
	console.log('ipn')
	res.redirect(process.env.PAYMENT_SUCCESS_URL)
}
const validate = async (req, res) => {
	console.log('validate')
	res.redirect(process.env.PAYMENT_FAILURE_URLL)
}
export { makePayment, successfulPayment, failedPayment, ipnPayment, validate }
