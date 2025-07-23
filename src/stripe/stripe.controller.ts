import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Stripe')
@Controller('stripe')

export class StripeController {
  constructor(private readonly stripeService: StripeService) { }

  @Post('create-checkout-session')
  async createCheckout(@Body() body: { amount: number; description: string }) {
    return this.stripeService.createCheckoutSession(body.amount, body.description);
  }

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() body: any) {
    const amount = body.amount;
    const currency = 'usd';
    const metadata = body.metadata;

    const result = await this.stripeService.createPaymentIntent(amount, currency, metadata);
    return result;
  }
}
