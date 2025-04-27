import { UserEntity } from '@/users/entities/user.entity';
import { BaseEntity } from '@/common/entities/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SectorEntity } from '../../sectors/entities/sector.entity';

@Entity('states')
export class State extends BaseEntity {
    @Column({ type: 'text' })
    descripcion: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precio: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    area: number;

    @Column({ type: 'int' })
    nroHabitaciones: number;

    @ManyToOne(() => SectorEntity, sector => sector.states)
    @JoinColumn({ name: 'sector_id' })
    sector: SectorEntity;

    @ManyToOne(() => UserEntity, user => user.states)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;
}
