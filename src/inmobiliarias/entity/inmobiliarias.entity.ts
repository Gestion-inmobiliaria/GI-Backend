import { Entity,Column} from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { IInmobiliarias } from '../interfaces/inmobiliarias.interface';
import { OneToMany } from 'typeorm';
//import { SucursalEntity} from '../entity/sucursal.entity'; 

@Entity({name :'inmobiliaria'})
export class InmobiliariaEntity extends BaseEntity implements IInmobiliarias{

    @Column({type: 'varchar', length: 100, nullable: false})
    nombre: string;

    @Column({ type: 'varchar', length: 70, nullable: false, unique: true})
    email: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    direccion: string;

    @Column({ type: 'boolean', default: false })  // columna para borrado lógico
    eliminado: boolean;
 
 /*   @OneToMany(() => SucursalEntity, (sucursal) => sucursal.inmobiliaria,)
    sucursales: SucursalEntity[];*/
}