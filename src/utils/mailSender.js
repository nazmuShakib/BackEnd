import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
	service: 'gmail',
	host: 'smtp.gmail.com',
	secure: false,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASSWORD,
	},
})

const sendMail = async (to, url, token) => {
	try {
		const mainConf = {
			from: process.env.EMAIL_USER,
			to,
			subject: 'Email Verification',
			text: `Hi! Please click on the link to verify your email ${`${url}/${token}`}`,
		}
		await transporter.sendMail(mainConf)
	} catch (err) {
		throw new Error(err)
	}
}
export default sendMail
