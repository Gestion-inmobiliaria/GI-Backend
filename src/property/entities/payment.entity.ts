import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { ContractEntity } from './contract.entity';
import { PaymentMethodEntity } from '@/realstate/entities/payment_method.entity';

export enum PaymentStatus {
    PENDING = 'pending',
    SUCCEEDED = 'succeeded',
    FAILED = 'failed',
    CANCELED = 'canceled'
}

@Entity({ name: 'payment' })
export class PaymentEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 255, nullable: false })
    stripePaymentIntentId: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    amount: number;

    @Column({ type: 'varchar', length: 3, nullable: false, default: 'USD' })
    currency: string;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        nullable: false
    })
    status: PaymentStatus;

    @Column({ type: 'text', nullable: true })
    stripeClientSecret: string;

    @Column({ type: 'json', nullable: true })
    metadata: any;

    @Column({ type: 'timestamp', nullable: true })
    paidAt: Date;

    @ManyToOne(() => ContractEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    contract: ContractEntity;

    @ManyToOne(() => PaymentMethodEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    payment_method: PaymentMethodEntity;
} 