import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendMailOptions, Attachment } from 'nodemailer/lib/mailer';

@Injectable()
export class ContractEmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    if (!process.env.MAILER_EMAIL || !process.env.MAILER_SECRET_KEY || !process.env.MAILER_SERVICE) {
      throw new Error('Faltan variables de entorno para envío de correo');
    }

    this.transporter = nodemailer.createTransport({
      service: process.env.MAILER_SERVICE,
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_SECRET_KEY,
      },
    });
  }

  async sendContractEmail(options: {
    to: string;
    clientName: string;
    pdfBuffer: Buffer;
  }): Promise<boolean> {
    const { to, clientName, pdfBuffer } = options;

    const mailOptions: SendMailOptions = {
      from: process.env.MAILER_EMAIL,
      to,
      subject: '📄 Contrato de adquisición de inmueble',
      html: `<p>Estimado/a <b>${clientName}</b>,<br><br>Adjunto encontrará su contrato digital en formato PDF.<br><br>Saludos cordiales.</p>`,
      attachments: [
        {
          filename: 'contrato.pdf',
          content: pdfBuffer,
        },
      ],
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      console.error('Error enviando contrato por correo:', err);
      return false;
    }
  }
}
