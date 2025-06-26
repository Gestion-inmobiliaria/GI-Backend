import { EmailService } from './email.service';
import { VisitNotificationDto } from './dto/visit-notification.dto';
import { Controller, Post, Body, HttpStatus, HttpException } from '@nestjs/common';


@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send-visit-notification')
  async sendVisitNotification(@Body() dto: VisitNotificationDto) {
    try {
      const { to, visitData } = dto;
      
      console.log('Datos recibidos para enviar correo:', dto);

      // Validaciones básicas
      if (!to || !visitData) {
        throw new HttpException(
          'Datos incompletos: se requiere email y datos de la visita',
          HttpStatus.BAD_REQUEST
        );
      }

      if (!this.isValidEmail(to)) {
        throw new HttpException(
          'Email inválido',
          HttpStatus.BAD_REQUEST
        );
      }
      
      // Generar HTML del correo
      const emailHtml = this.generateVisitEmailHtml(visitData);
      
      // Enviar correo usando tu servicio existente
      const success = await this.emailService.sendEmail({
        to,
        subject: `Confirmación de Visita - ${visitData.propertyAddress}`,
        html: emailHtml
      });

      if (success) {
        console.log('Correo enviado exitosamente a:', to);
        return { 
          success: true, 
          message: 'Correo de confirmación enviado exitosamente',
          statusCode: HttpStatus.OK
        };
      } else {
        throw new HttpException(
          'Error al enviar el correo',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          success: false,
          message: 'Error interno del servidor',
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private generateVisitEmailHtml(visitData: any): string {
    const visitDate = new Date(visitData.startDate).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const visitTime = new Date(visitData.startDate).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Visita</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background-color: #f5f5f5;
          }
          .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: white; 
            border-radius: 12px; 
            overflow: hidden; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px 20px; 
            text-align: center;
          }
          .header h1 { 
            font-size: 24px; 
            margin-bottom: 10px; 
            font-weight: 600;
          }
          .header p { 
            opacity: 0.9; 
            font-size: 16px;
          }
          .content { 
            padding: 30px 20px; 
          }
          .greeting { 
            font-size: 18px; 
            margin-bottom: 20px; 
            color: #2c3e50;
          }
          .visit-details { 
            background: #f8f9fa; 
            border-left: 4px solid #667eea; 
            padding: 20px; 
            margin: 20px 0; 
            border-radius: 0 8px 8px 0;
          }
          .detail-row { 
            display: flex; 
            margin-bottom: 12px; 
            align-items: flex-start;
          }
          .detail-label { 
            font-weight: 600; 
            min-width: 140px; 
            color: #495057;
            display: flex;
            align-items: center;
          }
          .detail-value { 
            color: #2c3e50; 
            flex: 1;
          }
          .icon { 
            margin-right: 8px; 
            font-size: 16px;
          }
          .notes { 
            background: #e3f2fd; 
            padding: 15px; 
            border-radius: 8px; 
            margin: 20px 0;
            border-left: 4px solid #2196f3;
          }
          .cta-section { 
            text-align: center; 
            margin: 30px 0;
          }
          .cta-button { 
            display: inline-block; 
            background: #28a745; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 6px; 
            font-weight: 600;
            transition: background 0.3s ease;
          }
          .cta-button:hover { 
            background: #218838; 
          }
          .footer { 
            background: #2c3e50; 
            color: white; 
            padding: 20px; 
            text-align: center;
          }
          .footer p { 
            margin-bottom: 5px; 
          }
          .footer small { 
            opacity: 0.8; 
            font-size: 12px;
          }
          .divider { 
            height: 2px; 
            background: linear-gradient(90deg, #667eea, #764ba2); 
            margin: 20px 0;
          }
          @media (max-width: 600px) {
            .container { margin: 10px; }
            .content { padding: 20px 15px; }
            .detail-row { flex-direction: column; margin-bottom: 15px; }
            .detail-label { min-width: auto; margin-bottom: 5px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏠 Confirmación de Visita</h1>
            <p>Su visita ha sido programada exitosamente</p>
          </div>
          
          <div class="content">
            <div class="greeting">
              Estimado/a <strong>${visitData.clientName}</strong>,
            </div>
            
            <p>Nos complace confirmar su visita programada. A continuación encontrará todos los detalles:</p>
            
            <div class="visit-details">
              <div class="detail-row">
                <div class="detail-label">
                  <span class="icon">📅</span> Fecha:
                </div>
                <div class="detail-value"><strong>${visitDate}</strong></div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">
                  <span class="icon">🕐</span> Hora:
                </div>
                <div class="detail-value"><strong>${visitTime}</strong></div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">
                  <span class="icon">🏠</span> Propiedad:
                </div>
                <div class="detail-value"><strong>${visitData.propertyAddress}</strong></div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">
                  <span class="icon">👤</span> Agente:
                </div>
                <div class="detail-value"><strong>${visitData.agentName}</strong></div>
              </div>
              
              <div class="detail-row">
                <div class="detail-label">
                  <span class="icon">📞</span> Su teléfono:
                </div>
                <div class="detail-value">${visitData.clientPhone}</div>
              </div>
            </div>
            
            ${visitData.notes ? `
            <div class="notes">
              <strong>📝 Notas adicionales:</strong><br>
              ${visitData.notes}
            </div>
            ` : ''}
            
            <div class="divider"></div>
            
            <p>Por favor, confirme su asistencia respondiendo a este correo o contactando directamente a su agente responsable.</p>
            
            <div class="cta-section">
              <a href="mailto:${process.env.MAILER_EMAIL}?subject=Confirmación de Visita - ${visitData.propertyAddress}" class="cta-button">
                ✅ Confirmar Asistencia
              </a>
            </div>
            
            <p><strong>Recomendaciones para la visita:</strong></p>
            <ul style="margin-left: 20px; color: #495057;">
              <li>Llegar 5 minutos antes de la hora programada</li>
              <li>Traer documento de identidad</li>
              <li>Preparar sus preguntas sobre la propiedad</li>
              <li>Contactar al agente en caso de algún inconveniente</li>
            </ul>
          </div>
          
          <div class="footer">
            <p><strong>Equipo de Ventas Inmobiliarias</strong></p>
            <p>📧 ${process.env.MAILER_EMAIL}</p>
            <small>Este es un correo automático. Para consultas, responda a esta dirección o contacte a su agente.</small>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}