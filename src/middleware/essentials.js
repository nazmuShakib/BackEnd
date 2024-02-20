import mongoose from 'mongoose'

const connectDB = async () => {
	try {
		const dbConnect = await mongoose.connect(process.env.DATABASE_URL)
		console.log(`connected to ${dbConnect.connection.port}`)
	} catch (error) {
		console.error(error)
	}
}
export default connectDB
