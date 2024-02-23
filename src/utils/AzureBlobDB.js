import sharp from 'sharp'
import { BlobServiceClient } from '@azure/storage-blob'
import { getImageHash } from './uniqueIdGenerator.js'

const containerName = `${process.env.AZURE_STORAGE_CONTAINER_NAME}`
const connectionString = `${process.env.AZURE_STORAGE_PROTOCOL};${process.env.AZURE_STORAGE_ACCOUNT_NAME};${process.env.AZURE_STORAGE_ACCOUNT_KEY};${process.env.AZURE_STORAGE_ENDPOINT}`

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
const containerClient = blobServiceClient.getContainerClient(containerName)

const uploadImageToStorage = async (image, propertyID) => {
	const blobName = `${propertyID}/${getImageHash(image.originalname, propertyID)}.webp`
	const blobPlaceHolderName = `${propertyID}/${getImageHash(image.originalname, propertyID)}-placeholder.webp`
	const blockBlobClient = containerClient.getBlockBlobClient(blobName)
	const blockBlobPlaceHolderClient = containerClient.getBlockBlobClient(blobPlaceHolderName)
	const imageBuffer = await sharp(image.buffer).toFormat('webp', { quality: 80 }).toBuffer()
	const imagePlaceHolderBuffer = await sharp(image.buffer).resize(32, 32).toFormat('webp').toBuffer()
	blockBlobClient.upload(imageBuffer, imageBuffer.length)
	blockBlobPlaceHolderClient.upload(imagePlaceHolderBuffer, imagePlaceHolderBuffer.length)
}
const uploadThumbnail = async (image, propertyID) => {
	const blobName = `${propertyID}/thumbnail.webp`
	const blockBlobClient = containerClient.getBlockBlobClient(blobName)
	const thumbBuffer = await sharp(image.buffer).resize(224, 224).toFormat('webp').toBuffer()
	await blockBlobClient.upload(thumbBuffer, thumbBuffer.length)
}
const getImageUrls = (images, propertyID) => {
	const imageUrls = images.map((image) => {
		const containerUrl = containerClient.url
		const blobName = `${propertyID}/${getImageHash(image.originalname, propertyID)}.webp`
		const blobPlaceHolderName = `${propertyID}/${getImageHash(image.originalname, propertyID)}-placeholder.webp`
		return { original: `${containerUrl}/${blobName}`, placeHolder: `${containerUrl}/${blobPlaceHolderName}` }
	})
	return imageUrls
}
export { uploadImageToStorage, uploadThumbnail, getImageUrls }
