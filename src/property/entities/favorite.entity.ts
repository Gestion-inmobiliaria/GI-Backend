import { BaseEntity } from 'src/common/entities/base.entity';
import { ClientEntity } from '@/users/entities/client.entity';
import { PropertyEntity } from './property.entity';
import { Column, Entity, ManyToOne, Index } from 'typeorm';

@Entity({ name: 'favorites' })
@Index(['client', 'property'], { unique: true }) // Evitar duplicados
export class FavoriteEntity extends BaseEntity {
    @ManyToOne(() => ClientEntity, { onDelete: 'CASCADE', nullable: false })
    client: ClientEntity;

    @ManyToOne(() => PropertyEntity, { onDelete: 'CASCADE', nullable: false })
    property: PropertyEntity;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    addedAt: Date;
} 