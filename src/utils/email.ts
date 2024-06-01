import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { log } from "./logger";
import { AppError } from "./customError";
interface Options {
  email: string;
  subject: string;
  text?: string;
  html?: string;
}
export async function sendEmail(options: Options) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: +process.env.EMAIL_PORT!,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const email: Mail.Options = {
    from: "Confirm Email <confirm@booking.io>",
    to: options.email,
    text: options.text,
    html: options.html,
    subject: options.subject,
  };
  try {
    await transporter.sendMail(email);
  } catch (e) {
    log.error(e);
    throw new AppError(
      "An error occured while sending the email , please try again!"
    );
  }
}
