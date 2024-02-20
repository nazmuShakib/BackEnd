import { config } from 'dotenv'
import express from 'express'
import connectDB from './src/middleware/essentials.js'

config()
connectDB()
const app = express()

app.listen(process.env.PORT, () => {
	console.log(`listening on port ${process.env.PORT}`)
})
