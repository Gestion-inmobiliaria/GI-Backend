import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntity } from './entities/plan.entity';
import { PlanService } from './services/plan.service';
import { RealStateEntity } from './entities/realstate.entity';
import { RealStateService } from './services/realstate.service';
import { PlanController } from './controllers/plan.controller';
import { SubscriptionEntity } from './entities/subscription.entity';
import { SubscriptionService } from './services/subscription.service';
import { PaymentMethodEntity } from './entities/payment_method.entity';
import { PaymentMethodService } from './services/payment_method.service';
import { RealStateController } from './controllers/realstate.controller';
import { SubscriptionPaymentEntity } from './entities/subscription_payment.entity';
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
        RealStateController
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

export class RealstateModule {}
