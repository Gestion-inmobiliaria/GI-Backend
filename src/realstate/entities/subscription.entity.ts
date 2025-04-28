import { PlanEntity } from './plan.entity';
import { RealStateEntity } from './realstate.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { SubscriptionPaymentEntity } from './subscription_payment.entity';



export enum SubscriptionState {
    active = 'active',
    inactive = 'inactive',
    pending = 'pending'
}

@Entity({ name: 'subscription' })
export class SubscriptionEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 100, nullable: false })
    init_date: string
  
    @Column({ type: 'varchar', length: 100, nullable: false })
    end_date: string
  
    @Column({ type: 'varchar', length: 100, nullable: false })
    last_payment_date: string
  
    @Column({ type: 'varchar', length: 100, nullable: false })
    next_payment_date: string
  
    @Column({ type: 'varchar', length: 100, nullable: false, enum: SubscriptionState, default: SubscriptionState.active })
    state: SubscriptionState
  
    @Column({ type: 'boolean', nullable: false, default: false })
    renewal: boolean
  
    @ManyToOne(() => RealStateEntity, (realState) => realState.subscriptions, { onDelete: 'CASCADE' })
    realState: RealStateEntity
  
    @ManyToOne(() => PlanEntity, (plan) => plan.subscriptions, { onDelete: 'CASCADE' })
    plan: PlanEntity
  
    @OneToMany(() => SubscriptionPaymentEntity, (subscriptionPay) => subscriptionPay.subscription, { onDelete: 'CASCADE', nullable: true })
    subscription_payments: SubscriptionPaymentEntity[];
}
