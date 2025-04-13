import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
// Importación directa sin usar la interfaz
// import { IBranch } from '../interfaces/branch.interface';
import { UserEntity } from 'src/users/entities/user.entity';

// Definición local de la interfaz
interface IBranch {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  description?: string;
  isActive: boolean;
  users?: UserEntity[];
}

@Entity({ name: 'branch' })
export class BranchEntity extends BaseEntity implements IBranch {
  @Column({ type: 'varchar', nullable: false, length: 100 })
  name: string;

  @Column({ type: 'varchar', nullable: false, length: 255 })
  address: string;

  @Column({ type: 'varchar', nullable: true, length: 20 })
  phone: string;

  @Column({ type: 'varchar', nullable: true, length: 100 })
  email: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', nullable: true, default: true })
  isActive: boolean;

  @OneToMany(() => UserEntity, (user) => user.branch)
  users: UserEntity[];
} 