import express from 'express'
import { addProperty, getProperty } from '../services/addPropertyServices.js'

const router = express.Router()

router
	.route('/addProperty')
	.get(getProperty)
	.post(addProperty)
	.put((req, res) => {
		res.end('put')
	})
	.delete((req, res) => {
		res.end('delete')
	})

export default router
