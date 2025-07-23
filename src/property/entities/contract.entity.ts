import { PropertyEntity } from "./property.entity";
import { BaseEntity } from "@/common/entities/base.entity";
import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { PaymentMethodEntity } from "@/realstate/entities/payment_method.entity";



export enum ContractType {
    COMPRA = 'COMPRA',
    VENTA = 'VENTA',
    ANTICRETICO = 'ANTICRETICO',
    ALQUILER = 'ALQUILER'
}

export enum ContractStatus {
    VIGENTE = 'VIGENTE',
    FINALIZADO = 'FINALIZADO',
}

export enum ContractFormat {
    PDF = 'pdf',
    HTML = 'html'
}

@Entity({ name: 'contract' })
export class ContractEntity extends BaseEntity {
    @Column({ type: 'integer', nullable: false })
    contractNumber: number;

    @Column({
        type: 'enum',
        enum: ContractType,
        nullable: false
    })
    type: ContractType;

    @Column({
        type: 'enum',
        enum: ContractStatus,
        nullable: false
    })
    status: ContractStatus;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    amount: number;
    
    @Column({ type: 'date', nullable: false })
    startDate: Date;
    
    @Column({ type: 'date', nullable: false })
    endDate: Date;
    
    // Datos del cliente
    @Column({ type: 'varchar', length: 100, nullable: false })
    clientName: string;
    
    @Column({ type: 'varchar', length: 50, nullable: false })
    clientDocument: string;
    
    @Column({ type: 'varchar', length: 255, nullable: true })
    clientPhone: string;
    
    @Column({ type: 'varchar', length: 255, nullable: true })
    clientEmail: string;
    
    // Datos del agente
    @Column({ type: 'varchar', length: 100, nullable: false })
    agentName: string;
    
    @Column({ type: 'varchar', length: 50, nullable: false })
    agentDocument: string;
    
    // Contenido del contrato
    @Column({ type: 'text', nullable: false })
    contractContent: string; // Base64 del PDF o HTML del contrato
    
    @Column({
        type: 'enum',
        enum: ContractFormat,
        default: ContractFormat.HTML,
        nullable: false
    })
    contractFormat: ContractFormat;
    
    @Column({ type: 'varchar', length: 255, nullable: true })
    notes: string;

    @ManyToOne(() => PropertyEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    property: PropertyEntity;

    @ManyToOne(() => PaymentMethodEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    payment_method: PaymentMethodEntity;
}
