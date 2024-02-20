import { config } from 'dotenv'
import express from 'express'

config()
const app = express()

app.listen(process.env.PORT, () => {
	console.log(`listening on port ${process.env.PORT}`)
})
