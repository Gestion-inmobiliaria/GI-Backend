import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ContractService } from '../services/contract.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentStripeService } from '../../realstate/services/payment-stripe.service';

interface CreatePaymentIntentDto {
  amount: number;
}

interface ConfirmPaymentDto {
  paymentIntentId: string;
}

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(
    private readonly contractService: ContractService,
    private readonly paymentStripeService: PaymentStripeService
  ) {}

  @Post('create-intent/:contractId')
  @ApiOperation({ summary: 'Crear intención de pago para un contrato' })
  @ApiResponse({ status: 201, description: 'Intención de pago creada exitosamente' })
  async createPaymentIntent(
    @Param('contractId') contractId: string,
    @Body() createPaymentIntentDto: CreatePaymentIntentDto,
  ) {
    try {
      const result = await this.contractService.createPaymentIntent(
        contractId,
        createPaymentIntentDto.amount
      );

      return {
        statusCode: 201,
        data: result,
        message: 'Intención de pago creada exitosamente'
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('confirm')
  @ApiOperation({ summary: 'Confirmar pago' })
  @ApiResponse({ status: 200, description: 'Pago confirmado exitosamente' })
  async confirmPayment(@Body() confirmPaymentDto: ConfirmPaymentDto) {
    try {
      const isConfirmed = await this.contractService.confirmPayment(
        confirmPaymentDto.paymentIntentId
      );

      return {
        statusCode: 200,
        data: { confirmed: isConfirmed },
        message: isConfirmed ? 'Pago confirmado exitosamente' : 'El pago no pudo ser confirmado'
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('stripe-public-key')
  @ApiOperation({ summary: 'Obtener clave pública de Stripe' })
  async getStripePublicKey() {
    return {
      statusCode: 200,
      data: {
        publicKey: process.env.STRIPE_PUBLIC_KEY || 'pk_test_...'
      }
    };
  }

  @Get('test-stripe-connection')
  @ApiOperation({ summary: 'Probar conexión con Stripe (Solo para debugging)' })
  async testStripeConnection() {
    try {
      await this.paymentStripeService.diagnoseConnectivity();
      return {
        statusCode: 200,
        message: 'Conexión con Stripe exitosa',
        data: { status: 'connected' }
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Error en conexión con Stripe',
        data: { 
          status: 'failed',
          error: error.message,
          details: {
            type: error.type,
            code: error.code,
            statusCode: error.statusCode
          }
        }
      };
    }
  }
} 