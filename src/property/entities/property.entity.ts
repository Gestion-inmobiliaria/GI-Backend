import { ImagenEntity } from './imagen.entity';
import { ContractEntity } from './contract.entity';
import { UbicacionEntity } from './ubicacion.entity';
import { UserEntity } from '@/users/entities/user.entity';
import { VisitEntity } from '@/users/entities/index.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { PropertyOwnerEntity } from './property_owner.entity';
import { SectorEntity } from '@/sectors/entities/sector.entity';
import { CategoryEntity} from '@/state/entities/category.entity';
import { ModalityEntity } from '@/state/entities/modality.entity'; 
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne} from 'typeorm';
import { ImpulsarProperty } from '@/impulsar_property/entities/impulsar_property.entity';


export enum EstadoProperty {
    DISPONIBLE = 'disponible',
    RESERVADO= 'reservado',
    VENDIDO = 'vendido',
    ALQUILADO = 'alquilado',
    ANTICRETADO= 'anticretado',
    OCUPADO= 'ocupado',
}

@Entity({ name: 'property' })
export class PropertyEntity extends BaseEntity {
    @Column({ type: 'text', nullable: false })
    descripcion: string;  

    @Column({ type: 'decimal', nullable: false})
    precio:number;

    @Column({type: 'enum', enum: EstadoProperty,default: EstadoProperty.DISPONIBLE})
    estado: EstadoProperty;

    @Column({type:'decimal', nullable: false})
    area:number;

    @Column({type:'int', nullable: false})
    NroHabitaciones:number;

    @Column({type:'int', nullable: false})
    NroBanos:number;
    
    @Column({ type: 'int',nullable: false})
    NroEstacionamientos:number;    

     @Column({ type: 'decimal', nullable: false, default: '0.0' })
    comision:number;

    @Column({ type: 'text', nullable: false,  default: 'Sin condiciones especiales.'  })
    condicion_Compra: string;

    // RELACIONES:
    
    @ManyToOne( ()=>UserEntity, (user) => user.propertys,{onDelete: 'CASCADE', nullable: true})
    user: UserEntity;
  
    @ManyToOne( ()=>CategoryEntity, (category) => category.propertys,{onDelete: 'CASCADE'})
    category: CategoryEntity;
    
    @ManyToOne(()=>ModalityEntity, (modality)=> modality.propertys,{onDelete: 'CASCADE'})
    modality: ModalityEntity;

    @ManyToOne( ()=>SectorEntity, (sector)=> sector.propertys,{onDelete: 'CASCADE'})
    sector: SectorEntity; 

    @OneToMany(()=>ImagenEntity, (imagen)=> imagen.property,{onDelete: 'CASCADE'})
    imagenes: ImagenEntity[];  
    
    @OneToOne(() => UbicacionEntity, (ubicacion) => ubicacion.property, { onDelete: 'CASCADE' })
    @JoinColumn()
    ubicacion: UbicacionEntity;
    
    @OneToMany(()=>PropertyOwnerEntity,(property_owner)=> property_owner.property,{onDelete: 'CASCADE'})
    property_owner: PropertyOwnerEntity[];

    @OneToMany(() => ContractEntity, (contract) => contract.property)
    contracts: ContractEntity[];

    @OneToMany( ()=>ImpulsarProperty, (impulsarProperty) => impulsarProperty.property, { onDelete: 'CASCADE' })
    impulsos: ImpulsarProperty[];

    @OneToMany(() => VisitEntity, (visit) => visit.property)
    visits: VisitEntity[];
}
