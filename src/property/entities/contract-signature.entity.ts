import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { ContractEntity } from './contract.entity';

export enum SignerType {
    CLIENT = 'CLIENT',
    AGENT = 'AGENT'
}

export enum SignatureStatus {
    PENDING = 'PENDING',
    SIGNED = 'SIGNED',
    EXPIRED = 'EXPIRED'
}

@Entity({ name: 'contract_signature' })
export class ContractSignatureEntity extends BaseEntity {
    @Column({
        type: 'enum',
        enum: SignerType,
        nullable: false
    })
    signerType: SignerType;

    @Column({ type: 'varchar', length: 100, nullable: false })
    signerName: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    signerDocument: string;

    @Column({ type: 'text', nullable: true })
    signatureImage: string; // Base64 de la imagen de firma

    @Column({ type: 'timestamp with time zone', nullable: true })
    signedAt: Date;

    @Column({ type: 'varchar', length: 45, nullable: true })
    ipAddress: string;

    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    signatureToken: string; // Token único para cada firmante

    @Column({ type: 'timestamp with time zone', nullable: false })
    tokenExpiration: Date;

    @Column({
        type: 'enum',
        enum: SignatureStatus,
        default: SignatureStatus.PENDING,
        nullable: false
    })
    status: SignatureStatus;

    @Column({ type: 'varchar', length: 255, nullable: true })
    userAgent: string; // Información del navegador

    @ManyToOne(() => ContractEntity, (contract) => contract.signatures, { onDelete: 'CASCADE' })
    @JoinColumn()
    contract: ContractEntity;
}