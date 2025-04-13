import { BaseEntity } from "src/common/entities/base.entity";
import { ManyToOne, JoinColumn, Column, Entity } from 'typeorm';
import { InmobiliariaEntity } from 'src/inmobiliarias/entities/inmobiliaria.entity';

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

  @ManyToOne(() => InmobiliariaEntity, (inmobiliaria) => inmobiliaria.clientes)
  @JoinColumn({ name: 'inmobiliaria_id' }) // crea columna inmobiliaria_id en la tabla
  inmobiliaria: InmobiliariaEntity;
}
