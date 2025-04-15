import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { RealStateEntity } from '@/realstate/entities/realstate.entity';
import { UserEntity } from '@/users/entities/user.entity';

@Entity({ name: 'sector' })
export class SectorEntity extends BaseEntity {
    @Column({ type: 'varchar', nullable: false, length: 100 })
    name: string;

    @Column({ type: 'varchar', nullable: true, length: 100 })
    adress: string;

    @Column({ type: 'varchar', nullable: true, length: 15 })
    phone: string;

    @ManyToOne(() => RealStateEntity, (realState) => realState.sectores, { onDelete: 'CASCADE' })
    realState: RealStateEntity;

    @OneToMany(() => UserEntity, (user) => user.sector)
    users: UserEntity[];
}
