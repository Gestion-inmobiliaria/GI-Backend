import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';



@Entity('modalities')
export class Modality {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    name: string;
}
