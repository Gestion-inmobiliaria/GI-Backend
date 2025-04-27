import { RoleEntity } from './role.entity';
import { Exclude } from 'class-transformer';
import { IUser } from '../interfaces/user.interface';
import { GENDER } from 'src/common/constants/gender';
import { State } from '@/state/entities/state.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { SectorEntity } from '@/sectors/entities/sector.entity';



@Entity({ name: 'user' })
export class UserEntity extends BaseEntity implements IUser {
    @Column({ type: 'int', unique: true, nullable: false })
    ci: number;

    @Column({ type: 'varchar', nullable: false, length: 100 })
    name: string;

    @Column({ type: 'varchar', nullable: false, length: 100, unique: true })
    email: string;

    @Exclude()
    @Column({ type: 'varchar', nullable: false })
    password: string;

    @Column({ type: 'varchar', nullable: true, length: 15 })
    phone: string;

    @Column({
      type: 'enum', enum: GENDER, nullable: true, default: GENDER.OTHER
    })
    gender: GENDER;

    @Column({ type: 'boolean', nullable: true, default: true })
    isActive: boolean;

    @ManyToOne(() => RoleEntity, (role) => role.users, { onDelete: 'CASCADE' })
    role: RoleEntity;

    @ManyToOne(() => SectorEntity, (sector) => sector.users, { onDelete: 'CASCADE', nullable: true })
    sector?: SectorEntity

    @OneToMany(() => State, (state) => state.user)
    states: State[];
}
