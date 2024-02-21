import express from 'express'
import multer from 'multer'
import { addProperty, getProperty } from '../services/addPropertyServices.js'

const router = express.Router()
const memoryStorage = multer.memoryStorage()
const upload = multer({ memoryStorage })

router
	.route('/addProperty')
	.get(getProperty)
	.post(upload.any(), addProperty)
	.put((req, res) => {
		res.end('put')
	})
	.delete((req, res) => {
		res.end('delete')
	})

export default router
