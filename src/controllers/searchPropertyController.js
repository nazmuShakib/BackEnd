import express from 'express'
import searchProperty from '../services/searchPropertyServices.js'

const router = express.Router()

router.route('/').post(searchProperty)

export default router
