import nodemailer, { type SendMailOptions } from "nodemailer"
import { env } from "~/env.mjs"

interface MailPayload {
    subject: string,
    to: string,
    text: string
}

export async function sendMail({ subject, to, text }: MailPayload) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: env.NODEMAILER_EMAIL,
            pass: env.NODEMAILER_PASSWORD
        }
    })

    const mailOptions: SendMailOptions = {
        from: env.NODEMAILER_EMAIL,
        to,
        subject,
        text
    }

    const response = await transporter.sendMail(mailOptions)

    return response
}