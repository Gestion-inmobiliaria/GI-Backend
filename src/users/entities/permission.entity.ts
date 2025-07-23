import { Entity } from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';
import { BaseEntity } from '../../common/entities/base.entity';



export enum PermissionType {
    INVENTORY = 'Iventario',
    SALES = 'Ventas',
    BUY = 'Compras',
    USERS = 'Usuarios',
    COMPANY = 'Empresa',
}

@Entity({ name: 'permission' })
export class PermissionEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 70, unique: true, nullable: false })
    name: string;
  
    @Column({ type: 'varchar', length: 255, nullable: true })
    description: string;
  
    @Column({ type: 'varchar', length: 255, nullable: false, enum: PermissionType})
    type: string;
}
