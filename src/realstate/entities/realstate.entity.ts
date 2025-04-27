import { Column, Entity, OneToMany } from 'typeorm';
import { SubscriptionEntity } from './subscription.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { SectorEntity } from '@/sectors/entities/sector.entity';



@Entity({ name: 'realstate' })
export class RealStateEntity extends BaseEntity {
    @Column({ type: 'varchar', nullable: false, length: 100 })
    name: string;
  
    @Column({ type: 'varchar', nullable: false, length: 100, unique: true })
    email: string;
  
    @Column({ type: 'varchar', nullable: false, length: 100 })
    address: string;
  
    @OneToMany(() => SectorEntity, (sector) => sector.realState, { onDelete: 'CASCADE', nullable: true })
    sectores?: SectorEntity[];
  
    @OneToMany(() => SubscriptionEntity, (subscription) => subscription.realState, { onDelete: 'CASCADE', nullable: true })
    subscriptions: SubscriptionEntity[]
}
