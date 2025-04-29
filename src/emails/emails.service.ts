import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import * as pug from 'pug';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
@Injectable()
export class EmailsService {
  constructor() {}
  newTransport(): nodemailer.Transporter {
    const transportOptions: SMTPTransport.Options = {
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    };

    return nodemailer.createTransport(transportOptions);
  }

  resend = new Resend(process.env.RESEND_API_KEY);
  //send with Resend
  //   async sendWelcomEmail(to: string, username: string) {

  //     const html = pug.renderFile(
  //       `${__dirname}/../views/emails/sendWelcome.pug`,
  //       {
  //         username: username,
  //       },
  //     );
  //     const { data, error } = await this.resend.emails.send({
  //       from: 'Acme <kasseimad81@gmail.com>',
  //       to, //this is the email of user
  //       subject: 'Welcome Email',
  //       html,
  //     });
  //     if (error) {
  //       console.error('Error sending email:', error);
  //       throw new Error('Failed to send email');
  //     }
  //     console.log('Email sent successfully:', data);
  //   }

  //send with NodeMailr
  async sendWelcomEmail(to: string, username: string) {
    const html = pug.renderFile(
      `${__dirname}/../views/emails/sendWelcome.pug`,
      {
        username: username,
      },
    );
    const mailOptions = {
      from: `kasse imad <${process.env.EMAIL_FROM}>`,
      to: to,
      html: html,
    };
    await this.newTransport().sendMail(mailOptions);
  }
  // send update password (forgetPassword , resetPassword)
}
