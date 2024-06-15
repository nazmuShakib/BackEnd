const allowedOrigins = ['http://localhost:5173', 'https://sandbox.sslcommerz.com']

const corsOptions = {
	origin: (origin, callback) => {
		if (!origin) {
			return callback(null, true)
		}
		if (origin === 'null') {
			return callback(null, true)
		}
		if (allowedOrigins.includes(origin)) {
			return callback(null, true)
		}
		return callback(new Error('Not allowed by CORS'))
	},
	credentials: true,
}

export default corsOptions
