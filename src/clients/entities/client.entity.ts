import { BaseEntity } from "src/common/entities/base.entity";
import { Entity, Column } from 'typeorm';



@Entity({ name: 'client' })
export class ClientEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    email: string;

    @Column({ type: 'varchar', length: 20, nullable: false })
    phone: string;

    @Column({ type: 'varchar', length: 20, nullable: false })
    ci: string;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;
}
