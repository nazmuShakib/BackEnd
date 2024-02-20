import express from 'express'

const router = express.Router()

router
	.route('/addProperty')
	.get((req, res) => {
		res.end('get')
	})
	.post((req, res) => {
		res.end('post')
	})
	.put((req, res) => {
		res.end('put')
	})
	.delete((req, res) => {
		res.end('delete')
	})

export default router
