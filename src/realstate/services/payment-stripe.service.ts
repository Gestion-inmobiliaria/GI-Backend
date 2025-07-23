import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { PAYMENTMETHOD } from '../entities/payment_method.entity';

interface PaymentIntentRequest {
  amount: number;
  currency: string;
  paymentMethod: PAYMENTMETHOD;
  clientEmail?: string;
  clientName?: string;
  contractNumber: string;
}

interface StripePaymentResponse {
  clientSecret: string;
  paymentIntentId: string;
  status: string;
}

@Injectable()
export class PaymentStripeService {
  private readonly logger = new Logger('PaymentStripeService');
  private stripe: Stripe;

  constructor() {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    this.logger.log('Inicializando servicio de Stripe...');
    
    if (!stripeSecretKey) {
      this.logger.error('STRIPE_SECRET_KEY no está configurada en las variables de entorno');
      throw new Error('Configuración de Stripe faltante: STRIPE_SECRET_KEY');
    }
    
    this.logger.log(`Usando clave de Stripe: ${stripeSecretKey.substring(0, 12)}...`);
    
    try {
      this.stripe = new Stripe(stripeSecretKey, {
        timeout: 30000, // 30 segundos
        maxNetworkRetries: 3,
        telemetry: false,
        typescript: true
      });
      
      this.logger.log('Servicio de Stripe inicializado correctamente');
      
      // Prueba de conexión básica
      this.testConnection();
      
    } catch (error) {
      this.logger.error('Error al inicializar Stripe:', error);
      throw error;
    }
  }

  private async testConnection(): Promise<void> {
    try {
      this.logger.log('Probando conexión con Stripe...');
      // No hacer await aquí para no bloquear la inicialización
      this.stripe.balance.retrieve()
        .then(() => {
          this.logger.log('✅ Conexión con Stripe exitosa');
        })
        .catch((error) => {
          this.logger.error('❌ Fallo en prueba de conexión con Stripe:', error.message);
        });
    } catch (error) {
      this.logger.error('Error en prueba de conexión:', error);
    }
  }

  async createPaymentIntent(request: PaymentIntentRequest): Promise<StripePaymentResponse> {
    this.logger.log(`Creando PaymentIntent para contrato: ${request.contractNumber}, monto: ${request.amount}`);
    
    try {
      let paymentMethodTypes: string[] = [];

      switch (request.paymentMethod) {
        case PAYMENTMETHOD.credit_card:
          paymentMethodTypes = ['card'];
          break;
        case PAYMENTMETHOD.cash:
          // Para efectivo, usamos card como simulación
          paymentMethodTypes = ['card'];
          break;
        case PAYMENTMETHOD.qr_code:
          // Para QR, usamos card como simulación (en producción puedes agregar 'us_bank_account' o 'link')
          paymentMethodTypes = ['card'];
          break;
        case PAYMENTMETHOD.crypto:
          // Para crypto, usamos card como simulación
          paymentMethodTypes = ['card'];
          break;
        default:
          paymentMethodTypes = ['card'];
      }

      const createParams = {
        amount: Math.round(request.amount * 100), // Stripe usa centavos
        currency: request.currency.toLowerCase(),
        payment_method_types: paymentMethodTypes,
        metadata: {
          contractNumber: request.contractNumber,
          paymentMethod: request.paymentMethod,
          clientEmail: request.clientEmail || '',
          clientName: request.clientName || ''
        },
      };

      this.logger.log('Parámetros de PaymentIntent:', JSON.stringify(createParams, null, 2));

      const paymentIntent = await this.stripe.paymentIntents.create(createParams);

      this.logger.log(`✅ PaymentIntent creado exitosamente: ${paymentIntent.id}`);

      return {
        clientSecret: paymentIntent.client_secret!,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status
      };
    } catch (error) {
      this.logger.error('❌ Error al crear PaymentIntent:', {
        message: error.message,
        type: error.type,
        code: error.code,
        statusCode: error.statusCode,
        requestId: error.requestId,
        stack: error.stack
      });
      
      // Re-lanzar con mensaje más descriptivo
      throw new Error(`Error al crear la intención de pago: ${error.message} (Código: ${error.code || 'unknown'})`);
    }
  }

  async confirmPayment(paymentIntentId: string): Promise<boolean> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent.status === 'succeeded';
    } catch (error) {
      this.logger.error('Error confirming payment:', error);
      return false;
    }
  }

  async createSimulatedPaymentForCash(amount: number, contractNumber: string): Promise<StripePaymentResponse> {
    // Para efectivo, creamos un pago simulado que se confirma automáticamente
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'usd',
        payment_method_types: ['card'],
        metadata: {
          contractNumber,
          paymentMethod: PAYMENTMETHOD.cash,
          simulated: 'true'
        },
        confirm: true,
        payment_method: await this.createTestPaymentMethod(),
        return_url: 'https://your-website.com/return'
      });

      return {
        clientSecret: paymentIntent.client_secret!,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status
      };
    } catch (error) {
      this.logger.error('Error creating simulated cash payment:', error);
      throw new Error(`Error al procesar pago en efectivo: ${error.message}`);
    }
  }

  private async createTestPaymentMethod(): Promise<string> {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: '4242424242424242',
        exp_month: 12,
        exp_year: 2025,
        cvc: '123',
      },
    });

    return paymentMethod.id;
  }

  async getPaymentDetails(paymentIntentId: string): Promise<any> {
    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      this.logger.error('Error retrieving payment details:', error);
      throw new Error(`Error al obtener detalles del pago: ${error.message}`);
    }
  }

  // Método para diagnosticar problemas de conectividad
  async diagnoseConnectivity(): Promise<void> {
    this.logger.log('🔍 Iniciando diagnóstico de conectividad con Stripe...');
    
    try {
      // Test 1: Verificar balance
      this.logger.log('Test 1: Verificando balance...');
      const balance = await this.stripe.balance.retrieve();
      this.logger.log('✅ Balance obtenido correctamente');
      
      // Test 2: Listar payment methods
      this.logger.log('Test 2: Listando métodos de pago...');
      const paymentMethods = await this.stripe.paymentMethods.list({ limit: 1 });
      this.logger.log('✅ Métodos de pago listados correctamente');
      
      // Test 3: Crear un PaymentIntent de prueba
      this.logger.log('Test 3: Creando PaymentIntent de prueba...');
      const testPaymentIntent = await this.stripe.paymentIntents.create({
        amount: 100, // $1.00
        currency: 'usd',
        payment_method_types: ['card'],
        metadata: { test: 'connectivity_test' }
      });
      this.logger.log(`✅ PaymentIntent de prueba creado: ${testPaymentIntent.id}`);
      
      this.logger.log('🎉 Todos los tests de conectividad pasaron exitosamente');
      
    } catch (error) {
      this.logger.error('❌ Fallo en diagnóstico de conectividad:', {
        message: error.message,
        type: error.type,
        code: error.code,
        statusCode: error.statusCode,
        requestId: error.requestId
      });
      throw error;
    }
  }
} 