import { Schema, model } from 'mongoose'

const transactionSchema = new Schema(
	{
		userID: {
			type: String,
			required: true,
			unique: true,
		},
		transactions: [
			{
				propertyID: {
					type: String,
					required: true,
				},
				propertyOwner: {
					type: String,
					required: true,
				},
				transactionID: {
					type: String,
					required: true,
				},
				transactionTime: {
					type: Date,
					required: true,
				},
				transactionStatus: {
					type: Boolean,
					default: false,
				},
			},
		],
	},
	{
		timestamps: true,
		statics: {
			async createTransaction(userID, propertyID, propertyOwner, transactionID) {
				let user = await this.findOne({ userID })
				if (!user) {
					user = new this({ userID, transactions: [] })
				}
				user.transactions.push({
					propertyID,
					propertyOwner,
					transactionID,
					transactionTime: new Date(),
				})
				await user.save()
			},
			async successfulTransaction(userID, transactionID) {
				const user = await this.findOne({ userID })
				if (!user) throw new Error('No transaction found')
				const res = user.transactions.find(
					(transaction) => transaction.transactionID === transactionID,
				)
				if (!res) throw new Error('No transaction found')
				if (res.transactionStatus) throw new Error('Failed to complete transaction')
				res.transactionStatus = true
				await user.save()
			},
			async failTransaction(userID, transactionID) {
				const user = await this.findOne({ userID })
				if (!user) throw new Error('No transaction found')
				const res = user.transactions.filter(
					(transaction) => transaction.transactionID !== transactionID,
				)
				user.transactions = res
				await user.save()
			},
		},
	},
)
export default model('Transaction', transactionSchema)
