import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { ContractEntity } from '@/property/entities/contract.entity';
import { SubscriptionPaymentEntity } from './subscription_payment.entity';


export enum PAYMENTMETHOD {
    cash = 'cash',
    credit_card = 'credit_card',
    crypto = 'crypto',
    qr_code = 'qr_code'
}

@Entity({ name: 'payment_method' })
export class PaymentMethodEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 100, nullable: false, enum: PAYMENTMETHOD, unique: true })
    name: PAYMENTMETHOD;
  
    @OneToMany(() => SubscriptionPaymentEntity, (subscriptionPay) => subscriptionPay.payment_method, { onDelete: 'CASCADE', nullable: true })
    subscription_payments: SubscriptionPaymentEntity[];

    @OneToMany(() => ContractEntity, (contract) => contract.payment_method)
    contracts: ContractEntity[];
}
