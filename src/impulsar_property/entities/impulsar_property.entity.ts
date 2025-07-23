import { PropertyEntity } from '@/property/entities/property.entity';
import { UserEntity } from '@/users/entities/user.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, ManyToOne} from 'typeorm';


export enum ImpulsoStatus{
 ACTIVO = "activo",
 EXPIRADO = "expirado",
 CANCELADO = "cancelado"
}

@Entity({name: 'impulsar_property'})
export class ImpulsarProperty extends BaseEntity{

 @Column({type: 'timestamp', nullable: false})
 startDate:Date;

 @Column({type: 'timestamp', nullable: false})
 endDate:Date;

@Column({type: 'enum',enum: ImpulsoStatus, default: ImpulsoStatus.ACTIVO}) 
 status:ImpulsoStatus;

 @Column({type: 'text', nullable: false})
 razonAImpulsar:string;

 @Column({type: 'text', nullable: true})
  razonACancelar?:string;

 @Column({type: 'timestamp', nullable: true})
 cancelled_at?:Date;

// relaciones 
@ManyToOne( () => PropertyEntity, (property)=> property.impulsos,{onDelete: 'CASCADE', nullable: false})
property: PropertyEntity;

@ManyToOne( ()=>UserEntity, (user) => user.impulsos,{onDelete: 'CASCADE', nullable: false})
user: UserEntity;
}