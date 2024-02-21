import { BlobServiceClient } from '@azure/storage-blob'

const containerName = `${process.env.AZURE_STORAGE_CONTAINER_NAME}`
const connectionString = `${process.env.AZURE_STORAGE_PROTOCOL};${process.env.AZURE_STORAGE_ACCOUNT_NAME};${process.env.AZURE_STORAGE_ACCOUNT_KEY};${process.env.AZURE_STORAGE_ENDPOINT}`

// eslint-disable-next-line prettier/prettier
const blobServiceClient =	BlobServiceClient.fromConnectionString(connectionString)
const containerClient = blobServiceClient.getContainerClient(containerName)

export default containerClient
