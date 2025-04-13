
import { Entity, Column, OneToMany } from 'typeorm';
import { ClientEntity } from 'src/clients/entities/client.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity({ name: 'inmobiliaria' })
export class InmobiliariaEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  direccion: string;

  @Column({ type: 'boolean', default: false })
  eliminado: boolean;

  @OneToMany(() => ClientEntity, (client) => client.inmobiliaria)
  clientes: ClientEntity[];
}
