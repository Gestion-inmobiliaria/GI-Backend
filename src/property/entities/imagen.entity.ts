import { Column, Entity, ManyToOne} from 'typeorm';
import { PropertyEntity } from './property.entity';
import { BaseEntity } from 'src/common/entities/base.entity';



@Entity({ name: 'imagen' })
export class ImagenEntity extends BaseEntity {
    @Column({ type: 'text', nullable: true })
    url: string;

    @ManyToOne(() => PropertyEntity, (property) => property.imagenes)
    property: PropertyEntity;
}
