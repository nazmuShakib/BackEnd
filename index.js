import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import './src/utils/envConnect.js'
import connectDB from './src/middleware/essentials.js'
import AddPropertyRouter from './src/controllers/addPropertyController.js'
import GetPropertyRouter from './src/controllers/getPropertyController.js'
import MyPropertyRouter from './src/controllers/myPropertyController.js'
import SearchPropertyRouter from './src/controllers/searchPropertyController.js'
import UserRouter from './src/controllers/userController.js'
import { reviewRouter, ratingRouter } from './src/controllers/ratingAndReviewController.js'

connectDB()
const app = express()

app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	}),
)
app.use(cookieParser())
app.use(express.json())
app.use(AddPropertyRouter)
app.use('/property', GetPropertyRouter)
app.use('/myProperty', MyPropertyRouter)
app.use('/search', SearchPropertyRouter)
app.use('/user', UserRouter)
app.use('/reviews', reviewRouter)
app.use('/ratings', ratingRouter)

app.listen(process.env.PORT, () => {
	console.log(`listening on port ${process.env.PORT}`)
})
