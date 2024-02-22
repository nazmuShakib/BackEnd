import express from 'express'
import multer from 'multer'
import addProperty from '../services/addPropertyServices.js'
import formValidator from '../middleware/formValidation.js'

const router = express.Router()
const memoryStorage = multer.memoryStorage()
const upload = multer({ memoryStorage })

router.route('/addProperty').post(upload.any(), formValidator, addProperty)

export default router
