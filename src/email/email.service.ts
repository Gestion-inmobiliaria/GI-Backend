import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { MailOptions } from 'nodemailer/lib/sendmail-transport';
import { SendMailOptions } from '@/providers/email/interfaces/sendMailOptions.interface';


@Injectable()
export class EmailService {

    private email: string;
    private transporter;

    constructor() {
        this.email = process.env.EMAIL_USER || '';
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    public async sendEmail(options: SendMailOptions): Promise<boolean> {
        const { to, subject, html, attachments } = options;
        try {
            await this.transporter.sendMail({
                from: this.email,
                to,
                subject,
                html,
                attachments
            } as MailOptions);
            return true;
        } catch (error) {
            return false;
        }
    }
}