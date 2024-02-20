import { config } from 'dotenv'
import express from 'express'
import connectDB from './src/middleware/essentials.js'
import AddPropertyRouter from './src/controllers/addPropertyController.js'

config()
connectDB()
const app = express()

app.use(express.json())
app.use(AddPropertyRouter)

app.listen(process.env.PORT, () => {
	console.log(`listening on port ${process.env.PORT}`)
})
