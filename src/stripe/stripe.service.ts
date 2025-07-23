import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {

});

@Injectable()
export class StripeService {

  async createPaymentIntent(
    amount: number,
    currency: string,
    metadata: Record<string, string>,
  ) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency,
        payment_method_types: ['card'],
        metadata,
      });

      return {
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error) {
      console.error('❌ Error al crear PaymentIntent:', error.message);
      throw new Error('No se pudo crear el PaymentIntent');
    }
  }



  async createCheckoutSession(amount: number, description: string) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: description,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://tu-app.com/pago-exitoso',
      cancel_url: 'https://tu-app.com/pago-cancelado',


      metadata: {
        propertyId: 'uuid-del-inmueble',
        clientName: 'Juan Pérez',
        clientDocument: 'CI-12345678',
        agentName: 'Agente 1',
        agentDocument: 'CI-9999999',
        amount: amount.toString(),
        paymentMethod: 'credit_card'
      },
    });

    return { url: session.url };
  }

}
