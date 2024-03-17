const REFRESH_TOKEN = {
	secret: process.env.AUTH_REFRESH_TOKEN_SECRET,
	expiry: 24 * 60 * 60,
	cookie: {
		name: 'refreshToken',
		options: {
			httpOnly: true,
			sameSite: 'None',
			secure: false,
			maxAge: 10 * 60 * 1000,
		},
	},
}
const ACCESS_TOKEN = {
	secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
	expiry: 10 * 60,
}
export { ACCESS_TOKEN, REFRESH_TOKEN }
