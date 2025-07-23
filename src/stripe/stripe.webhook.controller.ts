import { Controller, Post, Req, Res, Headers, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { ContractService } from '@/property/services/contract.service';
import { PaymentMethodService } from '@/realstate/services/payment_method.service';
import { ContractFormat, ContractStatus, ContractType } from '@/property/entities/contract.entity';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {

});

@Controller('webhook')
export class StripeWebhookController {
  constructor(
    private readonly contractService: ContractService,
    private readonly paymentMethodService: PaymentMethodService,
  ) { }

  @Post('stripe')
  async handleStripeEvent(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    let event: Stripe.Event;

    try {
      const rawBody = (req as any).rawBody;
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return res.status(HttpStatus.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata;

      try {
        const paymentMethod = await this.paymentMethodService.findByName(
          metadata.paymentMethod as any // porque metadata es string y tu método acepta PAYMENTMETHOD enum
        );

        const newContract = await this.contractService.create({
          contractNumber: Date.now(),
          type: ContractType.VENTA,
          status: ContractStatus.VIGENTE,
          amount: parseFloat(metadata.amount),
          startDate: new Date(),
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          clientName: metadata.clientName,
          clientDocument: metadata.clientDocument,
          agentName: metadata.agentName,
          agentDocument: metadata.agentDocument,
          contractContent: '<p>Pago confirmado automáticamente vía Stripe</p>',
          contractFormat: ContractFormat.PDF,
          propertyId: metadata.propertyId,
          paymentMethodId: paymentMethod.id,
        });

        console.log('✅ Contrato creado automáticamente:', newContract.id);
      } catch (error) {
        console.error('❌ Error al crear contrato:', error.message);
      }
    }

    res.status(HttpStatus.OK).send({ received: true });
  }
}
