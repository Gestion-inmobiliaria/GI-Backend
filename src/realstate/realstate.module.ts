import { Module } from '@nestjs/common';
import { RealStateController } from './controllers/realstate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RealStateEntity } from './entities/realstate.entity';
import { RealStateService } from './services/realstate.service';
import { PlanEntity } from './entities/plan.entity';
import { PaymentMethodEntity } from './entities/payment_method.entity';
import { SubscriptionPaymentEntity } from './entities/subscription_payment.entity';
import { SubscriptionEntity } from './entities/subscription.entity';
import { PlanController } from './controllers/plan.controller';
import { PlanService } from './services/plan.service';
import { SubscriptionService } from './services/subscription.service';
import { PaymentMethodService } from './services/payment_method.service';
import { PaymentMethodController } from './controllers/payment_method.controller';
// import { UsersModule } from '@/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RealStateEntity,
      PlanEntity,
      SubscriptionEntity,
      PaymentMethodEntity,
      SubscriptionPaymentEntity,
    ]),
    ConfigModule,
    // UsersModule,
  ],
  controllers: [
    PlanController,
    RealStateController,
    PaymentMethodController,
  ],
  providers: [
    RealStateService, PlanService, SubscriptionService, PaymentMethodService
  ],
  exports: [
    RealStateService,
    PlanService,
    SubscriptionService,
    PaymentMethodService,
    TypeOrmModule,
  ],
})
export class RealstateModule { }
