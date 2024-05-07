import express from 'express'
import multer from 'multer'
import addProperty from '../services/addPropertyServices.js'
import formValidator from '../middleware/formValidation.js'
import { verifyUser } from '../middleware/userAuthentication.js'

const router = express.Router()
const memoryStorage = multer.memoryStorage()
const upload = multer({ memoryStorage })

router.route('/').post(upload.any(), verifyUser, formValidator, addProperty)

export default router
