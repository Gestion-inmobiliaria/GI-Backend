import { UserEntity } from './user.entity';
import { BaseEntity } from '@/common/entities/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PropertyEntity } from '@/property/entities/property.entity';


@Entity({ name: 'visit' })
export class VisitEntity extends BaseEntity {
    @ManyToOne(() => UserEntity, (user) => user.visits, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: UserEntity;

    @ManyToOne(() => PropertyEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    property: PropertyEntity;

    @Column({ type: 'timestamp with time zone', nullable: false })
    visitedAt: Date;

    @Column({ type: 'varchar', length: 255, nullable: true })
    notes: string;
}
