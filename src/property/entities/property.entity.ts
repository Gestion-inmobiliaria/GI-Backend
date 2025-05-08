import { ImagenEntity } from './image.entity';
import { UbicacionEntity } from './ubicacion.entity';
import { UserEntity } from '@/users/entities/user.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { PropertyOwnerEntity } from './property_owner.entity';
import { SectorEntity } from '@/sectors/entities/sector.entity';
import { CategoryEntity} from '@/state/entities/category.entity';
import { ModalityEntity } from '@/state/entities/modality.entity'; 
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne} from 'typeorm';



export enum EstadoProperty {
    DISPONIBLE = 'disponible',
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

    @Column({type:'int', nullable: true})
    NroHabitaciones:number;

    @Column({type:'int', nullable: true})
    NroBanos:number;
    
    @Column({ type: 'int',nullable: true})
    NroEstacionamientos:number;

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
}
