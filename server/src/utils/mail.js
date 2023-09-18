import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  host:'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'leminhduc6402@gmail.com',
    pass: 'nvapqjllrsnuvbdh'
  }
});