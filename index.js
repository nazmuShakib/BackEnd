import express from 'express'
import cors from 'cors'
import './src/utils/envConnect.js'
import connectDB from './src/middleware/essentials.js'
import AddPropertyRouter from './src/controllers/addPropertyController.js'

connectDB()
const app = express()

app.use(
	cors({
		origin: 'http://localhost:5173',
	}),
)
app.use(express.json())
app.use(AddPropertyRouter)

app.listen(process.env.PORT, () => {
	console.log(`listening on port ${process.env.PORT}`)
})
