import sharp from 'sharp'
import { BlobServiceClient } from '@azure/storage-blob'
import { getImageHash } from './uniqueIdGenerator.js'

const containerName = `${process.env.AZURE_STORAGE_CONTAINER_NAME}`
const connectionString = `${process.env.AZURE_STORAGE_PROTOCOL};${process.env.AZURE_STORAGE_ACCOUNT_NAME};${process.env.AZURE_STORAGE_ACCOUNT_KEY};${process.env.AZURE_STORAGE_ENDPOINT}`

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
const containerClient = blobServiceClient.getContainerClient(containerName)

const uploadImageToStorage = async (image, propertyID) => {
	const blobName = `${propertyID}/${getImageHash(image.originalname, propertyID)}.webp`
	const blockBlobClient = containerClient.getBlockBlobClient(blobName)
	const imageBuffer = await sharp(image.buffer).toFormat('webp', { quality: 80 }).toBuffer()
	blockBlobClient.upload(imageBuffer, imageBuffer.length)
}
export default uploadImageToStorage
