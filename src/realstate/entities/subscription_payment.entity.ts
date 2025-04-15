import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { SubscriptionEntity } from './subscription.entity';
import { PaymentMethodEntity } from './payment_method.entity';

export enum PAYMENT_STATE {
  paid = 'paid',
  pending = 'pending',
  failed = 'failed'
}

@Entity({ name: 'subscription_payment' })
export class SubscriptionPaymentEntity extends BaseEntity {

  @Column({ type: 'varchar', nullable: false, length: 100 })
  payment_date: string;

  @Column({ type: 'float', nullable: false })
  amount: number;

  @Column({ type: 'enum', enum: PAYMENT_STATE, nullable: false, default: PAYMENT_STATE.paid })
  state: PAYMENT_STATE;

  @ManyToOne(() => SubscriptionEntity, (subscription) => subscription.subscription_payments, { onDelete: 'CASCADE' })
  subscription: SubscriptionEntity;

  @ManyToOne(() => PaymentMethodEntity, (paymentMethod) => paymentMethod.subscription_payments, { onDelete: 'CASCADE' })
  payment_method: PaymentMethodEntity;
}
